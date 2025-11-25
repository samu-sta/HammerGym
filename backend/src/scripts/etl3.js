import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import MachineModel from '../models/Machine.js';
import MachineModelModel from '../models/MachineModel.js';
import MaintenanceHistory from '../models/MaintenanceHistory.js';
import MachinePart from '../models/MachinePart.js';
import MachinePartReplaced from '../models/MachinePartReplaced.js';
import MachineMetrics from '../models/MachineMetrics.js';
import GymModel from '../models/Gym.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función auxiliar para leer CSV
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Mapeo de equipment_id del CSV a IDs de base de datos
const equipmentIdMap = {};

const runETL3 = async () => {
  try {
    console.log('\n🚀 Starting ETL3 Process - Equipment Data Import');
    console.log('='.repeat(60));

    // Paths a los CSVs
    const equipmentMasterPath = path.join(__dirname, '../../../datasets/equipment_master_2.csv');
    const maintenanceHistoryPath = path.join(__dirname, '../../../datasets/maintenance_history_2.csv');
    const equipmentMetricsPath = path.join(__dirname, '../../../datasets/equipment_metrics_2.csv');

    // Verificar que los archivos existen
    if (!fs.existsSync(equipmentMasterPath)) {
      throw new Error(`File not found: ${equipmentMasterPath}`);
    }
    if (!fs.existsSync(maintenanceHistoryPath)) {
      throw new Error(`File not found: ${maintenanceHistoryPath}`);
    }
    if (!fs.existsSync(equipmentMetricsPath)) {
      throw new Error(`File not found: ${equipmentMetricsPath}`);
    }

    // Leer los CSVs
    console.log('\n📂 Reading CSV files...');
    const equipmentMasterData = await readCSV(equipmentMasterPath);
    const maintenanceHistoryData = await readCSV(maintenanceHistoryPath);
    const equipmentMetricsData = await readCSV(equipmentMetricsPath);

    console.log(`✅ Equipment Master: ${equipmentMasterData.length} records`);
    console.log(`✅ Maintenance History: ${maintenanceHistoryData.length} records`);
    console.log(`✅ Equipment Metrics: ${equipmentMetricsData.length} records`);

    // Obtener el primer gimnasio disponible
    const gym = await GymModel.findOne();
    if (!gym) {
      throw new Error('No gym found in database. Please run initDB first.');
    }
    console.log(`\n🏢 Using gym: ${gym.location} (ID: ${gym.id})`);

    // PASO 1: Crear/Obtener MachineModels y Machines desde equipment_master_2.csv
    console.log('\n📊 STEP 1: Processing Equipment Master Data');
    console.log('-'.repeat(60));

    const machineModelCache = {}; // Cache para evitar duplicados

    for (const row of equipmentMasterData) {
      try {
        const {
          equipment_id,
          equipment_type,
          manufacturer,
          purchase_date,
          purchase_cost,
          replacement_value,
          criticality,
          location
        } = row;

        // Crear o encontrar MachineModel
        const modelKey = `${equipment_type}-${manufacturer}`;
        let machineModelId;

        if (machineModelCache[modelKey]) {
          machineModelId = machineModelCache[modelKey];
        } else {
          const [machineModel, created] = await MachineModelModel.findOrCreate({
            where: {
              name: equipment_type,
              brand: manufacturer
            },
            defaults: {
              name: equipment_type,
              brand: manufacturer,
              criticality: parseFloat(criticality)
            }
          });

          machineModelId = machineModel.id;
          machineModelCache[modelKey] = machineModelId;

          if (created) {
            console.log(`   ✅ Created MachineModel: ${equipment_type} (${manufacturer})`);
          }
        }

        // Crear Machine
        const machine = await MachineModel.create({
          machineModelId: machineModelId,
          gymId: gym.id,
          purchaseDate: purchase_date,
          purchaseCost: parseFloat(purchase_cost),
          replacementValue: parseFloat(replacement_value),
          location: location,
          status: 'available'
        });

        // Guardar mapeo equipment_id -> machine.id
        equipmentIdMap[equipment_id] = machine.id;

        console.log(`   ✅ Created Machine ID ${machine.id} for equipment ${equipment_id}`);

      } catch (error) {
        console.error(`   ❌ Error processing equipment ${row.equipment_id}:`, error.message);
      }
    }

    console.log(`\n✅ Step 1 Complete: ${Object.keys(equipmentIdMap).length} machines created`);

    // PASO 2: Crear MachineParts (catálogo único de piezas)
    console.log('\n📊 STEP 2: Creating Machine Parts Catalog');
    console.log('-'.repeat(60));

    const partsSet = new Set();
    
    // Extraer todas las piezas únicas del CSV
    for (const row of maintenanceHistoryData) {
      const partsReplaced = row.parts_replaced || 'None';
      if (partsReplaced !== 'None') {
        // Dividir por coma si hay múltiples piezas
        const parts = partsReplaced.split(',').map(p => p.trim());
        parts.forEach(part => partsSet.add(part));
      }
    }

    const machinePartMap = {}; // Mapeo nombre -> ID

    for (const partName of partsSet) {
      try {
        const [machinePart, created] = await MachinePart.findOrCreate({
          where: { name: partName },
          defaults: { name: partName }
        });

        machinePartMap[partName] = machinePart.id;

        if (created) {
          console.log(`   ✅ Created MachinePart: ${partName}`);
        }
      } catch (error) {
        console.error(`   ❌ Error creating part ${partName}:`, error.message);
      }
    }

    console.log(`\n✅ Step 2 Complete: ${Object.keys(machinePartMap).length} parts in catalog`);

    // PASO 3: Crear MaintenanceHistory desde maintenance_history_2.csv
    console.log('\n📊 STEP 3: Processing Maintenance History');
    console.log('-'.repeat(60));

    let maintenanceCount = 0;
    let partReplacedCount = 0;

    for (const row of maintenanceHistoryData) {
      try {
        const {
          work_order_id,
          equipment_id,
          date_reported,
          date_completed,
          maintenance_type,
          failure_mode,
          repair_cost,
          parts_replaced
        } = row;

        // Mapear equipment_id a machineId
        const machineId = equipmentIdMap[equipment_id];
        if (!machineId) {
          console.log(`   ⚠️  Skipping work order ${work_order_id}: equipment ${equipment_id} not found`);
          continue;
        }

        // Crear registro de mantenimiento
        const maintenance = await MaintenanceHistory.create({
          workOrderId: work_order_id,
          machineId: machineId,
          dateReported: date_reported,
          dateCompleted: date_completed,
          maintenanceType: maintenance_type,
          failureMode: failure_mode === 'None' ? null : failure_mode,
          repairCost: parseFloat(repair_cost)
        });

        maintenanceCount++;

        // Crear registros de piezas reemplazadas
        if (parts_replaced && parts_replaced !== 'None') {
          const parts = parts_replaced.split(',').map(p => p.trim());
          
          for (const partName of parts) {
            const partId = machinePartMap[partName];
            if (partId) {
              await MachinePartReplaced.create({
                maintenanceHistoryId: maintenance.id,
                machinePartId: partId
              });
              partReplacedCount++;
            }
          }
        }

        if (maintenanceCount % 20 === 0) {
          console.log(`   📝 Processed ${maintenanceCount} maintenance records...`);
        }

      } catch (error) {
        console.error(`   ❌ Error processing work order ${row.work_order_id}:`, error.message);
      }
    }

    console.log(`\n✅ Step 3 Complete: ${maintenanceCount} maintenance records created`);
    console.log(`   📦 ${partReplacedCount} part replacements recorded`);

    // PASO 4: Crear MachineMetrics desde equipment_metrics_2.csv
    console.log('\n📊 STEP 4: Processing Equipment Metrics');
    console.log('-'.repeat(60));

    let metricsCount = 0;

    for (const row of equipmentMetricsData) {
      try {
        const {
          equipment_id,
          month,
          total_operational_hours,
          total_sessions,
          avg_daily_peak_usage,
          vibration_level,
          temperature_deviation,
          power_consumption
        } = row;

        // Mapear equipment_id a machineId
        const machineId = equipmentIdMap[equipment_id];
        if (!machineId) {
          console.log(`   ⚠️  Skipping metrics for equipment ${equipment_id}: not found`);
          continue;
        }

        // Formatear fecha (YYYY-MM-DD con día 01)
        const monthDate = month.includes('-') ? `${month}-01` : month;

        // Crear métrica
        await MachineMetrics.create({
          machineId: machineId,
          month: monthDate,
          totalOperationalHours: parseInt(total_operational_hours),
          totalSessions: parseInt(total_sessions),
          avgDailyPeakUsage: parseInt(avg_daily_peak_usage),
          vibrationLevel: parseFloat(vibration_level),
          temperatureDeviation: parseFloat(temperature_deviation),
          powerConsumption: parseFloat(power_consumption)
        });

        metricsCount++;

        if (metricsCount % 30 === 0) {
          console.log(`   📊 Processed ${metricsCount} metrics records...`);
        }

      } catch (error) {
        console.error(`   ❌ Error processing metrics for ${row.equipment_id} (${row.month}):`, error.message);
      }
    }

    console.log(`\n✅ Step 4 Complete: ${metricsCount} metrics records created`);

    // RESUMEN FINAL
    console.log('\n' + '='.repeat(60));
    console.log('✅ ETL3 Process Completed Successfully!');
    console.log('='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   - Machine Models: ${Object.keys(machineModelCache).length} types`);
    console.log(`   - Machines: ${Object.keys(equipmentIdMap).length} units`);
    console.log(`   - Machine Parts: ${Object.keys(machinePartMap).length} types`);
    console.log(`   - Maintenance Records: ${maintenanceCount} entries`);
    console.log(`   - Part Replacements: ${partReplacedCount} entries`);
    console.log(`   - Metrics Records: ${metricsCount} monthly snapshots`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ETL3 Process Failed:', error);
    throw error;
  }
};

export default runETL3;
