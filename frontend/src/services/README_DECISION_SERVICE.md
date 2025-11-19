# Servicio de Decisión - Documentación

## Descripción

Este servicio centraliza todos los datos necesarios para el Sistema de Decisión de Entrenamiento (DSS). Actualmente devuelve datos locales, pero está preparado para migrar a una API REST.

## Estructura de Datos

### `datosDecisionCompletos`

Objeto JSON que contiene toda la información necesaria:

```json
{
  "usuario": {
    "id": "user1",
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com"
  },
  "perfil": {
    "edad": 32,
    "genero": "Masculino",
    "peso": 78,
    "altura": 175,
    "pulsacionesReposo": 65,
    "duracionSesiones": 60
  },
  "riesgoMetabolico": {
    "circunferenciaCintura": 85,
    "circunferenciaCinturaMaxima": 102,
    "ratio": 0.833
  },
  "observaciones": "...",
  "ejercicios": [
    {
      "id": "1",
      "nombre": "Press con Mancuernas",
      "tipo": "Empuje",
      "kpis": {
        "indiceAfinidad": 8.5,
        "eficienciaBiomecanica": 7.8
      }
    }
    // ... más ejercicios
  ],
  "progresion": [
    {
      "date": "Sem 1",
      "Press con Mancuernas": 50,
      "Press Militar": 45,
      // ... datos de todos los ejercicios
    }
    // ... más semanas
  ],
  "biomecanica": {
    "Fémur": [
      {
        "exercise": "Press con Mancuernas",
        "real": 42,
        "ideal": 42
      }
      // ... más ejercicios
    ]
    // ... más huesos
  },
  "metadata": {
    "fechaConsulta": "2025-11-04T10:30:00.000Z",
    "version": "1.0.0",
    "fuente": "datos-locales"
  }
}
```

## Funciones

### `getDatosDecisionUsuario(userEmail)`

**Función actual (datos locales):**
```javascript
export async function getDatosDecisionUsuario(userEmail) {
  const delay = Math.random() * 300 + 200
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: datosDecisionCompletos,
        timestamp: new Date().toISOString()
      })
    }, delay)
  })
}
```

**Implementación futura (API REST):**
```javascript
export async function getDatosDecisionUsuario(userEmail) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/decision/${userEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}` // Implementar según tu sistema de auth
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error al obtener datos de decisión:', error)
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}
```

### `formatearDatosParaComponentes(datosJSON)`

Convierte el formato JSON centralizado al formato que esperan los componentes React actuales (BentoGrid, SharedCharts).

**No necesita modificación** cuando se implemente la API, ya que solo transforma la estructura de datos.

## Endpoint de API Esperado

### GET `/api/decision/:userEmail`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response exitoso (200):**
```json
{
  "usuario": { ... },
  "perfil": { ... },
  "riesgoMetabolico": { ... },
  "observaciones": "...",
  "ejercicios": [ ... ],
  "progresion": [ ... ],
  "biomecanica": { ... },
  "metadata": { ... }
}
```

**Response error (404):**
```json
{
  "error": "Usuario no encontrado",
  "code": "USER_NOT_FOUND"
}
```

**Response error (500):**
```json
{
  "error": "Error interno del servidor",
  "code": "INTERNAL_ERROR"
}
```

## Migración a API - Checklist

- [ ] Crear endpoint `/api/decision/:userEmail` en el backend
- [ ] Implementar autenticación (verificar que el trainer tiene acceso al usuario)
- [ ] Definir constante `API_BASE_URL` en `/src/config/constants.js`
- [ ] Implementar función `getAuthToken()` para obtener el token JWT
- [ ] Actualizar `getDatosDecisionUsuario` con la implementación de fetch
- [ ] Añadir manejo de errores específicos (usuario no encontrado, sin autorización, etc.)
- [ ] Implementar cache/optimización si es necesario
- [ ] Testear con datos reales del backend
- [ ] Eliminar datos mock una vez validada la integración

## Uso en Componentes

```javascript
import { getDatosDecisionUsuario, formatearDatosParaComponentes } from '@/services/DecisionService'

// En el componente
const cargarDatos = async () => {
  const response = await getDatosDecisionUsuario(email)
  
  if (response.success) {
    const datosFormateados = formatearDatosParaComponentes(response.data)
    setUserData(datosFormateados)
  }
}
```

## Notas

- Por ahora, la función **siempre devuelve los datos de Juan Pérez**, independientemente del email
- El delay simulado (200-500ms) imita el comportamiento de una API real
- La estructura de datos está optimizada para ser compatible con el backend de HammerGym
- Los KPIs de ejercicios están incluidos en el JSON para facilitar visualizaciones futuras
