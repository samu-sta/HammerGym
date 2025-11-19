# ETL2 - Documentación

## Descripción
Script ETL para migrar datos de entrenadores, clientes, contratos, economía y clases desde archivos CSV a la base de datos.

## Archivos CSV Procesados

### 1. `clientes_3.csv`
Columnas utilizadas:
- `cliente_id` → ID del cliente
- `entrenador_asignado_id` → ID del entrenador asignado
- `fecha_inicio_contrato` → Fecha de inicio del contrato
- `fecha_fin_contrato` → Fecha de fin del contrato (puede ser null)
- `estado` → Estado del contrato (activo/inactivo)

### 2. `economia_3.csv`
Columnas utilizadas:
- `periodo` → Período en formato YYYY-MM
- `entrenador_id` → ID del entrenador
- `ingresos_generados` → Ingresos del período
- `costes_empleado` → Costes del período
- `clientes_activos` → Número de clientes activos
- `clientes_potenciales_grupo` → Clientes potenciales

### 3. `encuestas_3.csv`
Columnas utilizadas:
- `entrenador_id` → ID del entrenador
- `puntuacion` → Puntuación de la encuesta (1-5)
- `fecha_encuesta` → Fecha de la encuesta

### 4. `clases_3_enriched.csv`
Columnas utilizadas:
- `clase_id` → ID de la clase en el CSV
- `entrenador_id` → ID del entrenador que imparte
- `fecha_clase` → Fecha de la clase
- `capacidad_max` → Capacidad máxima
- `asistencia_real` → Asistencia real
- `name` → Nombre de la clase
- `description` → Descripción de la clase
- `difficulty` → Dificultad (low/medium/high)

## Mapeo de Datos

### DATASET → BASE DE DATOS

#### Trainer
- `valoracionPromedio` → `averageRating`
  - Calculado como promedio de todas las encuestas del entrenador

#### ClientTrainerContract
- `cliente_id` → `clientId` (referencia a User.accountId)
- `entrenador_asignado_id` → `trainerId` (referencia a Trainer.accountId)
- `fecha_inicio_contrato` → `startDate`
- `fecha_fin_contrato` → `endDate`

#### MonthlyEconomyTrainer
- `periodo` → `period` (formato YYYY-MM)
- `entrenador_id` → `trainerId`
- `ingresos_generados` → `income`
- `costes_empleado` → `costs`
- `clientes_activos` → `activeClients`
- `clientes_potenciales_grupo` → `potentialClients`

#### Class / Schedule / Attendance
- `name` → `Class.name`
- `description` → `Class.description`
- `difficulty` → `Class.difficulty`
- `capacidad_max` → `Class.maxCapacity`
- `entrenador_id` → `Class.trainerId`
- `fecha_clase` → `Schedule.startDate` y `Schedule.endDate` (mismo día)
- `asistencia_real` → Número de registros `Attendance` creados

## Proceso ETL2

### Paso 1: Crear Entrenadores con Valoraciones
1. Lee datos de `economia_3.csv` y `encuestas_3.csv`
2. Extrae IDs únicos de entrenadores
3. Calcula valoración promedio desde encuestas
4. Crea cuentas (Account) para entrenadores nuevos
5. Crea o actualiza registros en Trainer con `averageRating`

### Paso 2: Crear Clientes
1. Lee datos de `clientes_3.csv`
2. Verifica si el cliente ya existe
3. Crea cuentas (Account) para clientes nuevos
4. Crea registros en User (cliente)

### Paso 3: Crear Contratos Cliente-Entrenador
1. Por cada registro en `clientes_3.csv`
2. Busca el clientId y trainerId correspondientes
3. Crea registro en ClientTrainerContract
4. Campos: clientId, trainerId, startDate, endDate

### Paso 4: Crear Economía Mensual
1. Lee datos de `economia_3.csv`
2. Por cada registro de economía
3. Busca el trainerId correspondiente
4. Crea registro en MonthlyEconomyTrainer
5. Campos: period, trainerId, income, costs, activeClients, potentialClients

### Paso 5: Crear Clases, Horarios y Asistencias
1. Lee datos de `clases_3_enriched.csv`
2. Agrupa clases por entrenador y nombre
3. Crea registros en Class (si no existen)
4. Por cada fecha de clase:
   - Crea Schedule con startDate = endDate = fecha_clase
   - Crea registros en Attendance según asistencia_real
   - Asigna clientes aleatoriamente a las asistencias

## Consideraciones Importantes

### IDs de Cuentas
- El script verifica IDs existentes antes de crear nuevos
- Evita conflictos con datos creados por ETL1 o initDB.js
- Los trainerId y clientId del CSV se mapean a accountId en la BD

### Prevención de Duplicados
- Usa `findOrCreate` y `findOne` para evitar duplicados
- Verifica existencia antes de insertar
- Actualiza registros existentes cuando es necesario

### Relaciones
- Todas las foreign keys se validan antes de insertar
- ClientTrainerContract relaciona User (cliente) con Trainer
- MonthlyEconomyTrainer relaciona con Trainer
- Class relaciona con Trainer
- Attendance relaciona User con Class y fecha específica

## Ejecución

El ETL2 se ejecuta automáticamente después de ETL1 en `initDB.js`:

```javascript
// Ejecutar ETL1
await runETL();

// Ejecutar ETL2
await runETL2();
```

## Resultados Esperados

Al finalizar ETL2, se habrán creado:
- ✅ 7 Entrenadores con valoraciones calculadas
- ✅ 54 Clientes (usuarios)
- ✅ 54 Contratos cliente-entrenador
- ✅ 42 Registros de economía mensual (7 entrenadores × 6 meses)
- ✅ 7 Clases únicas
- ✅ 243 Horarios de clase (uno por cada fecha)
- ✅ ~2400+ Asistencias (según asistencia_real de cada clase)

## Logs y Debugging

El script proporciona logs detallados:
- ✅ Registros creados exitosamente
- ⏭️  Registros saltados (ya existen)
- ❌ Errores con detalles específicos
- 📊 Resumen al final de cada paso
