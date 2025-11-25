## 📊 *Estructura Propuesta*

### *1. Modelo Machine (ya existe) - AMPLIAR*
javascript
// Campos a AGREGAR al modelo existente:
{
  id: DataTypes.INTEGER (ya existe),
  machineModelId: DataTypes.INTEGER , // (FK)
  purchaseDate: DataTypes.DATE, // NUEVO
  purchaseCost: DataTypes.DECIMAL(10, 2), // NUEVO
  replacementValue: DataTypes.DECIMAL(10, 2), // NUEVO
  location: DataTypes.STRING, // NUEVO: "Cardio Zone", "Strength Area"
  status: DataTypes.ENUM('active', 'maintenance', 'broken'), // Ya existe probablemente
  gymId: DataTypes.INTEGER // Relación con Gym (si existe)
}

### *1. Modelo MachineModel (ya existe) - AMPLIAR*
javascript
// Campos a AGREGAR al modelo existente:
{
  id: DataTypes.INTEGER (ya existe),
  name: DataTypes.STRING (ya existe),
  brand: DataTypes.STRING, // NUEVO: "Life Fitness", "Precor" (ya existe, el manufacturer pasa a ser brand)
  criticality: DataTypes.DECIMAL(2, 1), // NUEVO: 3.6 - 4.8
}

### *2. Modelo MaintenanceHistory (NUEVO)*
javascript
{
  id: DataTypes.INTEGER, // PK auto-increment
  machineId: DataTypes.INTEGER, // FK -> Machine.id
  dateReported: DataTypes.DATE,
  dateCompleted: DataTypes.DATE,
  maintenanceType: DataTypes.ENUM('Preventive', 'Corrective'),
  failureMode: DataTypes.STRING, // "Belt", "Motor", "None"
  repairCost: DataTypes.DECIMAL(10, 2),
  partsReplaced: DataTypes.STRING // "Belt", "Motor", "None"
}

// Asociaciones:
MaintenanceHistory.belongsTo(Machine, { foreignKey: 'machineId' });
Machine.hasMany(MaintenanceHistory, { foreignKey: 'machineId' });

### *2. Modelo MachinePartReplaced (NUEVO)*
{
  maintenanceHistoryId: DataTypes.INTEGER,
  machinePartId: DataTypes.INTEGER
}

### *2. Modelo MachinePart (NUEVO)*
{
  id: DataTypes.INTEGER,
  name: DataTypes.STRING, // "Belt", "Motor"
}

### *3. Modelo MachineMetrics (NUEVO)*
javascript
{
  id: DataTypes.INTEGER, // PK auto-increment
  machineId: DataTypes.INTEGER, // FK -> Machine.id
  month: DataTypes.DATE, // "2024-07-01" (primer día del mes)
  totalOperationalHours: DataTypes.INTEGER,
  totalSessions: DataTypes.INTEGER,
  avgDailyPeakUsage: DataTypes.INTEGER,
  vibrationLevel: DataTypes.DECIMAL(4, 2),
  temperatureDeviation: DataTypes.DECIMAL(4, 2),
  powerConsumption: DataTypes.DECIMAL(4, 2)
}

// Asociaciones:
MachineMetrics.belongsTo(Machine, { foreignKey: 'machineId' });
Machine.hasMany(MachineMetrics, { foreignKey: 'machineId' });

// Índice único para evitar duplicados:
// UNIQUE(machineId, month)