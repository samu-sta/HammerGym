import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import AccountModel from '../models/Account.js';
import UserModel from '../models/User.js';
import TrainerModel from '../models/Trainer.js';
import ClientTrainerContractModel from '../models/ClientTrainerContract.js';
import MonthlyEconomyTrainerModel from '../models/MonthlyEconomyTrainer.js';
import ClassModel from '../models/Class.js';
import ScheduleModel from '../models/Schedule.js';
import AttendanceModel from '../models/Attendance.js';
import argon2 from 'argon2';

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

// Función para calcular el promedio de valoración de un entrenador
const calculateAverageRating = (surveysData, trainerId) => {
  const trainerSurveys = surveysData.filter(
    survey => parseInt(survey.entrenador_id) === trainerId
  );
  
  if (trainerSurveys.length === 0) return 0;
  
  const sum = trainerSurveys.reduce(
    (acc, survey) => acc + parseInt(survey.puntuacion), 
    0
  );
  
  return Math.round(sum / trainerSurveys.length);
};

// Función para crear entrenadores con valoraciones
const createTrainersWithRatings = async (economyData, surveysData) => {
  console.log('\n👨‍🏫 Creando entrenadores con valoraciones...');
  
  // Obtener IDs únicos de entrenadores del CSV de economía
  const trainerIds = [...new Set(economyData.map(row => parseInt(row.entrenador_id)))];
  console.log(`📊 Entrenadores únicos encontrados: ${trainerIds.length}`);
  
  const trainersCreated = [];
  
  // Obtener cuentas existentes para determinar el siguiente ID disponible
  const existingAccounts = await AccountModel.findAll({
    order: [['id', 'DESC']],
    limit: 1
  });
  
  let nextAccountId = existingAccounts.length > 0 ? existingAccounts[0].id + 1 : 1;
  console.log(`📍 Siguiente ID de cuenta disponible: ${nextAccountId}`);
  
  for (const trainerId of trainerIds) {
    try {
      // Verificar si el entrenador ya existe
      const existingTrainer = await TrainerModel.findOne({
        where: { accountId: trainerId }
      });
      
      if (existingTrainer) {
        console.log(`⏭️  Entrenador ${trainerId} ya existe, actualizando valoración...`);
        
        // Calcular y actualizar la valoración promedio
        const averageRating = calculateAverageRating(surveysData, trainerId);
        await existingTrainer.update({ averageRating });
        
        trainersCreated.push({ 
          trainerId: trainerId, 
          accountId: trainerId,
          isNew: false 
        });
        continue;
      }
      
      // Crear cuenta para el nuevo entrenador
      const hashedPassword = await argon2.hash(`trainer${trainerId}pass`);
      const trainerAccount = await AccountModel.create({
        email: `trainer${trainerId}@hammergym.com`,
        username: `Trainer${trainerId}`,
        password: hashedPassword
      });
      
      // Calcular valoración promedio desde las encuestas
      const averageRating = calculateAverageRating(surveysData, trainerId);
      
      // Crear entrenador con valoración
      const trainer = await TrainerModel.create({
        accountId: trainerAccount.id,
        averageRating: averageRating
      });
      
      trainersCreated.push({ 
        trainerId: trainerId, 
        accountId: trainerAccount.id,
        isNew: true,
        averageRating: averageRating
      });
      
      console.log(`✅ Entrenador ${trainerId} creado con valoración ${averageRating} (Account ID: ${trainerAccount.id})`);
      
    } catch (error) {
      console.error(`❌ Error creando entrenador ${trainerId}:`, error.message);
    }
  }
  
  return trainersCreated;
};

// Función para crear clientes (usuarios) desde el CSV de clientes
const createClientsFromCSV = async (clientsData) => {
  console.log('\n👥 Creando clientes desde CSV...');
  
  const clientsCreated = [];
  
  // Obtener usuarios existentes para determinar el siguiente ID disponible
  const existingAccounts = await AccountModel.findAll({
    order: [['id', 'DESC']],
    limit: 1
  });
  
  console.log(`📊 Total de registros de clientes en CSV: ${clientsData.length}`);
  
  for (const row of clientsData) {
    try {
      const clientId = parseInt(row.cliente_id);
      
      // Verificar si el cliente ya existe
      const existingUser = await UserModel.findOne({
        where: { accountId: clientId }
      });
      
      if (existingUser) {
        console.log(`⏭️  Cliente ${clientId} ya existe, saltando...`);
        clientsCreated.push({ 
          clientId: clientId, 
          accountId: clientId 
        });
        continue;
      }
      
      // Crear cuenta para el cliente
      const hashedPassword = await argon2.hash(`client${clientId}pass`);
      const clientAccount = await AccountModel.create({
        email: `client${clientId}@hammergym.com`,
        username: `Client${clientId}`,
        password: hashedPassword
      });
      
      // Crear usuario (cliente)
      const client = await UserModel.create({
        accountId: clientAccount.id,
        age: null,
        gender: null,
        weight: null,
        height: null
      });
      
      clientsCreated.push({ 
        clientId: clientId, 
        accountId: clientAccount.id 
      });
      
      console.log(`✅ Cliente ${clientId} creado (Account ID: ${clientAccount.id})`);
      
    } catch (error) {
      console.error(`❌ Error creando cliente ${row.cliente_id}:`, error.message);
    }
  }
  
  return clientsCreated;
};

// Función para crear contratos cliente-entrenador
const createClientTrainerContracts = async (clientsData, trainersCreated, clientsCreated) => {
  console.log('\n📝 Creando contratos cliente-entrenador...');
  
  let contractsCreated = 0;
  let contractsSkipped = 0;
  
  for (const row of clientsData) {
    try {
      const clientId = parseInt(row.cliente_id);
      const trainerId = parseInt(row.entrenador_asignado_id);
      
      // Buscar el accountId del cliente
      const client = clientsCreated.find(c => c.clientId === clientId);
      if (!client) {
        console.log(`⏭️  Cliente ${clientId} no encontrado, saltando contrato...`);
        contractsSkipped++;
        continue;
      }
      
      // Buscar el accountId del entrenador
      const trainer = trainersCreated.find(t => t.trainerId === trainerId);
      if (!trainer) {
        console.log(`⏭️  Entrenador ${trainerId} no encontrado, saltando contrato...`);
        contractsSkipped++;
        continue;
      }
      
      // Verificar si el contrato ya existe
      const existingContract = await ClientTrainerContractModel.findOne({
        where: {
          clientId: client.accountId,
          trainerId: trainer.accountId,
          startDate: row.fecha_inicio_contrato
        }
      });
      
      if (existingContract) {
        console.log(`⏭️  Contrato para cliente ${clientId} y entrenador ${trainerId} ya existe`);
        contractsSkipped++;
        continue;
      }
      
      // Crear contrato
      await ClientTrainerContractModel.create({
        clientId: client.accountId,
        trainerId: trainer.accountId,
        startDate: row.fecha_inicio_contrato,
        endDate: row.fecha_fin_contrato || null
      });
      
      contractsCreated++;
      
      if (contractsCreated % 10 === 0) {
        console.log(`✅ ${contractsCreated} contratos creados...`);
      }
      
    } catch (error) {
      console.error(`❌ Error creando contrato para cliente ${row.cliente_id}:`, error.message);
      contractsSkipped++;
    }
  }
  
  console.log(`✅ Total contratos creados: ${contractsCreated}`);
  console.log(`⚠️  Total contratos saltados: ${contractsSkipped}`);
  
  return contractsCreated;
};

// Función para crear economía mensual de entrenadores
const createMonthlyEconomyTrainer = async (economyData, trainersCreated) => {
  console.log('\n💰 Creando datos de economía mensual por entrenador...');
  
  let economyRecordsCreated = 0;
  let economyRecordsSkipped = 0;
  
  for (const row of economyData) {
    try {
      const trainerId = parseInt(row.entrenador_id);
      
      // Buscar el accountId del entrenador
      const trainer = trainersCreated.find(t => t.trainerId === trainerId);
      if (!trainer) {
        console.log(`⏭️  Entrenador ${trainerId} no encontrado, saltando registro económico...`);
        economyRecordsSkipped++;
        continue;
      }
      
      // Verificar si el registro ya existe
      const existingRecord = await MonthlyEconomyTrainerModel.findOne({
        where: {
          period: row.periodo,
          trainerId: trainer.accountId
        }
      });
      
      if (existingRecord) {
        // Actualizar el registro existente
        await existingRecord.update({
          income: parseFloat(row.ingresos_generados),
          costs: parseFloat(row.costes_empleado),
          activeClients: parseInt(row.clientes_activos),
          potentialClients: parseInt(row.clientes_potenciales_grupo)
        });
        economyRecordsSkipped++;
        continue;
      }
      
      // Crear registro de economía mensual
      await MonthlyEconomyTrainerModel.create({
        period: row.periodo,
        trainerId: trainer.accountId,
        income: parseFloat(row.ingresos_generados),
        costs: parseFloat(row.costes_empleado),
        activeClients: parseInt(row.clientes_activos),
        potentialClients: parseInt(row.clientes_potenciales_grupo)
      });
      
      economyRecordsCreated++;
      
      if (economyRecordsCreated % 10 === 0) {
        console.log(`✅ ${economyRecordsCreated} registros económicos creados...`);
      }
      
    } catch (error) {
      console.error(`❌ Error creando registro económico:`, error.message);
      economyRecordsSkipped++;
    }
  }
  
  console.log(`✅ Total registros económicos creados: ${economyRecordsCreated}`);
  console.log(`⚠️  Total registros económicos actualizados/saltados: ${economyRecordsSkipped}`);
  
  return economyRecordsCreated;
};

// Función para crear clases, horarios y asistencias
const createClassesSchedulesAttendance = async (classesData, trainersCreated, clientsCreated) => {
  console.log('\n🏋️ Creando clases, horarios y asistencias...');
  
  let classesCreated = 0;
  let schedulesCreated = 0;
  let attendancesCreated = 0;
  let classesSkipped = 0;
  
  console.log(`📊 Total de registros de clases en CSV: ${classesData.length}`);
  
  // Procesar cada clase individualmente (una clase por cada clase_id del dataset)
  for (const row of classesData) {
    try {
      const classId = parseInt(row.clase_id);
      const trainerId = parseInt(row.entrenador_id);
      const className = row.name || `Clase ${classId}`;
      const classDate = row.fecha_clase;
      const maxCapacity = parseInt(row.capacidad_max);
      const realAttendance = parseInt(row.asistencia_real);
      const difficulty = row.difficulty || 'medium';
      const description = row.description || 'Clase de entrenamiento';
      
      // Buscar el accountId del entrenador
      const trainer = trainersCreated.find(t => t.trainerId === trainerId);
      if (!trainer) {
        console.log(`⏭️  Entrenador ${trainerId} no encontrado para clase ${classId}, saltando...`);
        classesSkipped++;
        continue;
      }
      
      // Primero buscar si la clase ya existe
      let classInstance = await ClassModel.findOne({
        where: { id: classId }
      });
      
      if (classInstance) {
        // Ya existe, saltar
        classesSkipped++;
        continue;
      } else {
        // No existe, crear
        classInstance = await ClassModel.create({
          id: classId,
          name: className,
          description: description,
          maxCapacity: maxCapacity,
          currentCapacity: 0,
          difficulty: difficulty,
          trainerId: trainer.accountId
        });
        classesCreated++;
        
        if (classesCreated % 50 === 0) {
          console.log(`✅ ${classesCreated} clases creadas...`);
        }
      }
      
      // Crear horario para esta clase (startDate y endDate son la misma fecha)
      const existingSchedule = await ScheduleModel.findOne({
        where: {
          classId: classInstance.id,
          startDate: classDate,
          endDate: classDate
        }
      });
      
      if (!existingSchedule) {
        await ScheduleModel.create({
          classId: classInstance.id,
          startDate: classDate,
          endDate: classDate
        });
        schedulesCreated++;
      }
      
      // Crear asistencias para esta clase en esta fecha
      // Seleccionar aleatoriamente clientes según la asistencia real
      const availableClients = [...clientsCreated];
      
      for (let i = 0; i < realAttendance && availableClients.length > 0; i++) {
        // Seleccionar cliente aleatorio
        const randomIndex = Math.floor(Math.random() * availableClients.length);
        const client = availableClients[randomIndex];
        availableClients.splice(randomIndex, 1);
        
        try {
          // Verificar si la asistencia ya existe
          const existingAttendance = await AttendanceModel.findOne({
            where: {
              classId: classInstance.id,
              userId: client.accountId,
              attendanceDate: classDate
            }
          });
          
          if (!existingAttendance) {
            await AttendanceModel.create({
              classId: classInstance.id,
              userId: client.accountId,
              attendanceDate: classDate
            });
            attendancesCreated++;
          }
        } catch (error) {
          // Ignorar errores de clave duplicada
          if (!error.message.includes('PRIMARY')) {
            console.error(`❌ Error creando asistencia para clase ${classId}:`, error.message);
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Error procesando clase ${row.clase_id}:`, error.message);
      // Mostrar detalles adicionales del error si están disponibles
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => {
          console.error(`   - ${err.path}: ${err.message}`);
        });
      }
      classesSkipped++;
    }
  }
  
  console.log(`✅ Total clases creadas: ${classesCreated}`);
  console.log(`⚠️  Total clases saltadas: ${classesSkipped}`);
  console.log(`✅ Total horarios creados: ${schedulesCreated}`);
  console.log(`✅ Total asistencias creadas: ${attendancesCreated}`);
  
  return { classesCreated, schedulesCreated, attendancesCreated };
};

// Función principal ETL2
export const runETL2 = async () => {
  try {
    console.log('\n🚀 ==========================================');
    console.log('🚀 Iniciando proceso ETL2...');
    console.log('🚀 ==========================================');

    // Rutas de los archivos CSV en la carpeta datasets
    const datasetsPath = path.join(__dirname, '../../../datasets');
    const clientsPath = path.join(datasetsPath, 'clientes_3.csv');
    const economyPath = path.join(datasetsPath, 'economia_3.csv');
    const surveysPath = path.join(datasetsPath, 'encuestas_3.csv');
    const classesPath = path.join(datasetsPath, 'clases_3.csv');

    console.log('📂 Rutas de archivos CSV:');
    console.log(`   Clientes: ${clientsPath}`);
    console.log(`   Economía: ${economyPath}`);
    console.log(`   Encuestas: ${surveysPath}`);
    console.log(`   Clases: ${classesPath}`);

    // Verificar que los archivos existen
    const missingFiles = [];
    if (!fs.existsSync(clientsPath)) missingFiles.push('clientes_3.csv');
    if (!fs.existsSync(economyPath)) missingFiles.push('economia_3.csv');
    if (!fs.existsSync(surveysPath)) missingFiles.push('encuestas_3.csv');
    if (!fs.existsSync(classesPath)) missingFiles.push('clases_3.csv');

    if (missingFiles.length > 0) {
      console.log('⚠️  Archivos no encontrados:', missingFiles.join(', '));
      console.log('   Saltando ETL2');
      return;
    }

    // Leer CSVs
    console.log('\n📂 Leyendo archivos CSV...');
    const clientsData = await readCSV(clientsPath);
    const economyData = await readCSV(economyPath);
    const surveysData = await readCSV(surveysPath);
    const classesData = await readCSV(classesPath);

    console.log(`📊 Registros de clientes: ${clientsData.length}`);
    console.log(`📊 Registros de economía: ${economyData.length}`);
    console.log(`📊 Registros de encuestas: ${surveysData.length}`);
    console.log(`📊 Registros de clases: ${classesData.length}`);

    // Paso 1: Crear entrenadores con valoraciones
    console.log('\n' + '='.repeat(50));
    console.log('PASO 1: CREANDO ENTRENADORES CON VALORACIONES');
    console.log('='.repeat(50));
    const trainers = await createTrainersWithRatings(economyData, surveysData);
    console.log(`\n📊 Resumen: ${trainers.length} entrenadores procesados`);

    // Paso 2: Crear clientes
    console.log('\n' + '='.repeat(50));
    console.log('PASO 2: CREANDO CLIENTES');
    console.log('='.repeat(50));
    const clients = await createClientsFromCSV(clientsData);
    console.log(`\n📊 Resumen: ${clients.length} clientes procesados`);

    // Paso 3: Crear contratos cliente-entrenador
    console.log('\n' + '='.repeat(50));
    console.log('PASO 3: CREANDO CONTRATOS CLIENTE-ENTRENADOR');
    console.log('='.repeat(50));
    const contractsCount = await createClientTrainerContracts(clientsData, trainers, clients);

    // Paso 4: Crear economía mensual
    console.log('\n' + '='.repeat(50));
    console.log('PASO 4: CREANDO ECONOMÍA MENSUAL POR ENTRENADOR');
    console.log('='.repeat(50));
    const economyCount = await createMonthlyEconomyTrainer(economyData, trainers);

    // Paso 5: Crear clases, horarios y asistencias
    console.log('\n' + '='.repeat(50));
    console.log('PASO 5: CREANDO CLASES, HORARIOS Y ASISTENCIAS');
    console.log('='.repeat(50));
    const classesResult = await createClassesSchedulesAttendance(classesData, trainers, clients);

    console.log('\n✅ ==========================================');
    console.log('✅ PROCESO ETL2 COMPLETADO EXITOSAMENTE');
    console.log('✅ ==========================================');
    console.log('\n📊 RESUMEN FINAL:');
    console.log(`   - Entrenadores procesados: ${trainers.length}`);
    console.log(`   - Clientes creados: ${clients.length}`);
    console.log(`   - Contratos creados: ${contractsCount}`);
    console.log(`   - Registros económicos creados: ${economyCount}`);
    console.log(`   - Clases creadas: ${classesResult.classesCreated}`);
    console.log(`   - Horarios creados: ${classesResult.schedulesCreated}`);
    console.log(`   - Asistencias creadas: ${classesResult.attendancesCreated}`);
    console.log('\n✅ Los datos de entrenadores, clientes y clases han sido importados exitosamente!\n');

    return {
      success: true,
      trainers: trainers.length,
      clients: clients.length,
      contracts: contractsCount,
      economy: economyCount,
      classes: classesResult.classesCreated,
      schedules: classesResult.schedulesCreated,
      attendances: classesResult.attendancesCreated
    };

  } catch (error) {
    console.error('\n❌ ==========================================');
    console.error('❌ ERROR EN PROCESO ETL2');
    console.error('❌ ==========================================');
    console.error(error);
    throw error;
  }
};

export default runETL2;
