# Equipment Datasets Endpoint

## Endpoint: `GET /api/machines/admin/datasets`

**Descripción:** Recupera toda la información de equipamiento almacenada en la base de datos, incluyendo máquinas, historial de mantenimiento, métricas operacionales y catálogo de piezas. Este endpoint está protegido y solo accesible para administradores.

### Autenticación
- **Requerida:** ✅ Sí
- **Rol:** Admin
- **Middleware:** `authAdmin`
- **Headers requeridos:**
  - `Authorization: Bearer <token>` o
  - `x-access-token: <token>` o
  - Cookie `token=<token>`

### Response Structure

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalMachines": 12,
      "totalMaintenanceRecords": 93,
      "totalMetricsRecords": 144,
      "totalParts": 8,
      "machinesByStatus": {
        "available": 10,
        "broken": 1,
        "preparing": 1
      },
      "maintenanceByType": {
        "Preventive": 73,
        "Corrective": 20
      },
      "totalRepairCost": 15840.50,
      "recentMaintenanceCount": 12
      "averageKPIs": {
        "equipmentUptime": 85.42,
        "maintenanceCostRelative": 12.35
      }
    },
    "machines": [
      {
        "id": 1,
        "purchaseDate": "2022-03-15",
        "purchaseCost": "3800.00",
        "replacementValue": "3344.00",
        "location": "Cardio Zone",
        "status": "available",
        "machineModelId": 1,
        "gymId": 1,
        "model": {
          "id": 1,
          "name": "Treadmill",
          "brand": "Life Fitness",
          "criticality": "4.7"
        },
        "gym": {
          "id": 1,
          "location": "Budapest"
        },
        "kpis": {
          "equipmentUptime": 87.25,
          "maintenanceCostRelative": 15.42,
          "diasDespuesDeFallo": 15
        }
      }
      // ... más máquinas
    ],
    "maintenanceHistory": [
      {
        "id": 93,
        "workOrderId": "93",
        "machineId": 9,
        "dateReported": "2025-06-28",
        "dateCompleted": "2025-06-30",
        "maintenanceType": "Corrective",
        "failureMode": "Motor",
        "repairCost": "720.00",
        "machine": {
          "id": 9,
          "model": {
            "name": "Treadmill",
            "brand": "Life Fitness"
          }
        },
        "partsReplaced": [
          {
            "id": 2,
            "name": "Motor"
          }
        ]
      }
      // ... más registros de mantenimiento (ordenados por fecha DESC)
    ],
    "machineMetrics": [
      {
        "id": 1,
        "machineId": 1,
        "month": "2025-06-01",
        "totalOperationalHours": 872,
        "totalSessions": 395,
        "avgDailyPeakUsage": 5,
        "vibrationLevel": "0.42",
        "temperatureDeviation": "1.33",
        "powerConsumption": "1.76",
        "machine": {
          "id": 1,
          "model": {
            "name": "Treadmill",
            "brand": "Life Fitness"
          }
        }
      }
      // ... más métricas (ordenadas por machineId ASC, month DESC)
    ],
    "machineParts": [
      {
        "id": 1,
        "name": "Bearings"
      },
      {
        "id": 2,
        "name": "Belt"
      },
      {
        "id": 3,
        "name": "Cables"
      },
      {
        "id": 4,
        "name": "Display"
      },
      {
        "id": 5,
        "name": "Motor"
      }
      // ... catálogo completo de piezas (ordenado alfabéticamente)
    ]
  }
}
```

### Campos Retornados

#### `summary` (Resumen Estadístico)
- `totalMachines`: Número total de máquinas en el sistema
- `totalMaintenanceRecords`: Total de registros de mantenimiento
- `totalMetricsRecords`: Total de registros de métricas mensuales
- `totalParts`: Cantidad de tipos de piezas en el catálogo
- `machinesByStatus`: Distribución de máquinas por estado (available, broken, preparing, outOfService)
- `maintenanceByType`: Distribución de mantenimientos (Preventive vs Corrective)
- `totalRepairCost`: Suma total de costos de reparación (histórico)
- `recentMaintenanceCount`: Cantidad de mantenimientos en los últimos 30 días
- `averageKPIs`: Promedios de KPIs calculados para todas las máquinas
  - `equipmentUptime`: Promedio de tiempo operativo (%)
  - `maintenanceCostRelative`: Promedio de costo relativo de mantenimiento (%)

#### `machines` (Equipamiento Master)
Lista completa de todas las máquinas con:
- Información de compra (fecha, costo, valor de reemplazo)
- Ubicación física (Cardio Zone, Strength Area, etc.)
- Estado actual
- Relación con modelo de máquina (tipo, marca, criticidad)
- Relación con gimnasio
- **KPIs calculados** (`kpis` object):
  - `equipmentUptime`: Porcentaje de tiempo operativo en los últimos 12 meses
  - `maintenanceCostRelative`: Porcentaje del costo de mantenimiento sobre valor de reemplazo (últimos 12 meses)
  - `diasDespuesDeFallo`: Días estimados hasta próximo fallo (constante: 15) - **TODO: Integrar con servicio ML**

#### `maintenanceHistory` (Historial de Mantenimiento)
Registro completo de órdenes de trabajo con:
- ID de orden de trabajo (`workOrderId`)
- Fechas de reporte y completación
- Tipo de mantenimiento (Preventive/Corrective)
- Modo de falla (Belt, Motor, Electrical, etc.)
- Costo de reparación
- Lista de piezas reemplazadas (relación N:M normalizada)
- Ordenado por fecha de completación (más recientes primero)

#### `machineMetrics` (Métricas Operacionales)
Snapshots mensuales de datos operacionales:
- Horas operacionales totales
- Número de sesiones de uso
- Pico de uso diario promedio
- Nivel de vibración (sensores IoT)
- Desviación de temperatura (sensores IoT)
- Consumo de energía
- Ordenado por máquina y mes (más recientes primero)

**Nota:** Los siguientes campos **NO** están incluidos por ser calculables:
- `age_months`: Calculable desde `purchaseDate` + `month`
- `failure_count_12m`: Calculable desde `maintenanceHistory`
- `maintenance_cost_12m`: Calculable desde `maintenanceHistory.repairCost`
- `downtime_days_12m`: Calculable desde `dateCompleted - dateReported`
- `days_since_last_failure`: Calculable desde `MAX(dateCompleted)`
- `dias_hasta_proximo_fallo`: Campo de predicción ML (no incluido)

#### `machineParts` (Catálogo de Piezas)
Lista de todas las piezas de repuesto disponibles:
- ID único
- Nombre de la pieza
- Ordenado alfabéticamente

### Casos de Uso

1. **Dashboard Administrativo**: Visualizar estado general del equipamiento con KPIs en tiempo real
2. **Análisis Predictivo**: Exportar datos para modelos de machine learning
3. **Reportes de Costos**: Calcular costos de mantenimiento por período
4. **Planificación de Mantenimiento**: Identificar máquinas que requieren atención basándose en KPIs
5. **Gestión de Inventario**: Verificar piezas más reemplazadas
6. **Monitoreo de Uptime**: Evaluar eficiencia operacional de cada máquina
7. **Optimización de Costos**: Detectar máquinas con costos de mantenimiento excesivos

### KPIs Calculados

#### 1. Equipment Uptime (%)
**Fórmula:** `(operationalHours / (daysInPeriod × hoursPerDay)) × 100`

**Descripción:** Mide el porcentaje de tiempo que la máquina estuvo operativa en los últimos 12 meses.

**Interpretación:**
- **> 85%**: Excelente disponibilidad
- **70-85%**: Buena disponibilidad
- **50-70%**: Requiere atención
- **< 50%**: Crítico - requiere intervención inmediata

#### 2. Coste de Mantenimiento Relativo (%)
**Fórmula:** `(Σ repairCost12m / replacementValue) × 100`

**Descripción:** Mide el costo de mantenimiento de los últimos 12 meses como porcentaje del valor de reemplazo de la máquina.

**Interpretación:**
- **< 10%**: Costo de mantenimiento aceptable
- **10-20%**: Costo moderado - monitorear
- **20-30%**: Costo alto - evaluar reemplazo
- **> 30%**: Crítico - reemplazo recomendado

#### 3. Días Después de Fallo (Predicción)
**Valor Actual:** Constante = 15 días

**Descripción:** Días estimados hasta el próximo fallo. Actualmente retorna una constante.

**TODO:** Integrar con servicio de predicción ML que considere:
- Historial de fallos
- Métricas de IoT (vibración, temperatura, consumo)
- Edad de la máquina
- Tipo de uso

### Casos de Uso

1. **Dashboard Administrativo**: Visualizar estado general del equipamiento
2. **Análisis Predictivo**: Exportar datos para modelos de machine learning
3. **Reportes de Costos**: Calcular costos de mantenimiento por período
4. **Planificación de Mantenimiento**: Identificar máquinas que requieren atención
5. **Gestión de Inventario**: Verificar piezas más reemplazadas

### Errores Posibles

| Código | Descripción |
|--------|-------------|
| 401    | Token no proporcionado o inválido |
| 403    | Acceso denegado (usuario no es admin) |
| 500    | Error interno del servidor |

### Ejemplo de Petición

```bash
curl -X GET http://localhost:3000/api/machines/admin/datasets \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Notas Técnicas

- **Normalización**: Los datos siguen la estructura normalizada 3NF propuesta en `pregunta2.md`
- **Relaciones N:M**: Las piezas reemplazadas están correctamente normalizadas en la tabla junction `MachinePartReplaced`
- **Performance**: El endpoint usa eager loading (includes) para optimizar queries
- **Ordenamiento**: Datos ordenados lógicamente para facilitar análisis secuencial
