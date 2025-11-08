import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import AccountModel from '../models/Account.js';
import UserModel from '../models/User.js';
import ExerciseModel from '../models/Exercise.js';
import BoneModel from '../models/Bone.js';
import BoneMeasuresUserModel from '../models/BoneMeasuresUser.js';
import TrainingModel from '../models/Training.js';
import TrainingDayModel from '../models/TrainingDay.js';
import SerieModel from '../models/Serie.js';
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

// Función para crear usuarios desde el CSV de medidas
const createUsersFromMeasures = async (measuresData) => {
  console.log('\n📊 Creando usuarios desde datos de medidas...');
  const usersCreated = [];
  
  for (const row of measuresData) {
    try {
      // Verificar si el usuario ya existe
      const existingAccount = await AccountModel.findOne({
        where: { email: `user${row.user_id}@hammergym.com` }
      });

      if (existingAccount) {
        console.log(`⏭️  Usuario ${row.user_id} ya existe, saltando...`);
        continue;
      }

      // Crear cuenta
      const hashedPassword = await argon2.hash(`password${row.user_id}`);
      const account = await AccountModel.create({
        email: `user${row.user_id}@hammergym.com`,
        username: `User${row.user_id}`,
        password: hashedPassword
      });

      // Mapear género
      let gender = null;
      if (row.gender) {
        const genderLower = row.gender.toLowerCase();
        if (genderLower === 'male' || genderLower === 'm') {
          gender = 'male';
        } else if (genderLower === 'female' || genderLower === 'f') {
          gender = 'female';
        } else {
          gender = 'other';
        }
      }

      // Crear usuario con los datos del CSV
      const user = await UserModel.create({
        accountId: account.id,
        age: row.age ? parseInt(row.age) : null,
        gender: gender,
        weight: row.weight_kg ? parseFloat(row.weight_kg) : null,
        height: row.height_m ? parseFloat(row.height_m) : null,
        restingBpm: row.resting_bpm ? parseInt(row.resting_bpm) : null,
        sessionDurationHours: row.session_duration_hours ? parseFloat(row.session_duration_hours) : null,
        fatPercentage: row.fat_percentage ? parseFloat(row.fat_percentage) : null,
        waistCircumferenceCm: row.waist_circumference_cm ? parseFloat(row.waist_circumference_cm) : null,
        maxWaistCircumferenceCm: row.max_waist_circumference_cm ? parseFloat(row.max_waist_circumference_cm) : null
      });

      usersCreated.push({ userId: row.user_id, accountId: account.id });
      console.log(`✅ Usuario ${row.user_id} creado exitosamente (${account.email})`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${row.user_id}:`, error.message);
    }
  }

  return usersCreated;
};

// Función para crear huesos y medidas de usuario por ejercicio
const createBonesAndMeasures = async (measuresData, usersCreated) => {
  console.log('\n🦴 Creando huesos y medidas de usuario por ejercicio...');
  
  // Definir los huesos básicos
  const boneDefinitions = [
    { name: 'femur', columnReal: 'femur_length_cm', csvName: 'femur' },
    { name: 'tibia', columnReal: 'tibia_length_cm', csvName: 'tibia' },
    { name: 'humerus', columnReal: 'humerus_length_cm', csvName: 'humero' },
    { name: 'radius', columnReal: 'radius_length_cm', csvName: 'radio' },
    { name: 'torso', columnReal: 'torso_length_cm', csvName: 'torso' }
  ];

  // Mapeo de nombres de ejercicios en CSV de medidas a nombres en la base de datos
  const exerciseMapping = {
    'press_mancuernas': 'Press con Mancuernas',
    'press_militar': 'Press Militar',
    'press_banca': 'Press Banca',
    'press_inclinado': 'Press Inclinado',
    'fondos': 'Fondos',
    'dominadas': 'Dominadas',
    'jalon_pecho': 'Jalón al Pecho',
    'remo_barra': 'Remo con Barra',
    'peso_muerto_rumano': 'Peso Muerto Rumano',
    'remo_mancuerna': 'Remo con Mancuerna',
    'sentadilla': 'Sentadilla',
    'prensa_piernas': 'Prensa de Piernas',
    'extensiones_cuadriceps': 'Extensiones de Cuádriceps',
    'peso_muerto': 'Peso Muerto',
    'zancadas': 'Zancadas'
  };

  // Crear huesos si no existen
  const bones = {};
  for (const boneDef of boneDefinitions) {
    try {
      const [bone] = await BoneModel.findOrCreate({
        where: { name: boneDef.name },
        defaults: { name: boneDef.name }
      });
      bones[boneDef.name] = bone;
      console.log(`✅ Hueso "${boneDef.name}" verificado/creado`);
    } catch (error) {
      console.error(`❌ Error creando hueso ${boneDef.name}:`, error.message);
    }
  }

  // Obtener todos los ejercicios de la base de datos
  const exercises = await ExerciseModel.findAll();
  const exercisesByName = {};
  exercises.forEach(ex => {
    exercisesByName[ex.name] = ex;
  });

  console.log(`📋 Ejercicios encontrados: ${exercises.length}`);

  // Crear medidas por usuario, ejercicio y hueso
  let measuresCreated = 0;
  let measuresUpdated = 0;
  let measuresFailed = 0;
  
  for (const row of measuresData) {
    try {
      const userCreated = usersCreated.find(u => u.userId === row.user_id);
      if (!userCreated) {
        console.log(`⏭️  Usuario ${row.user_id} no encontrado, saltando...`);
        continue;
      }

      // Verificar que el usuario existe en la BD
      const userExists = await UserModel.findOne({
        where: { accountId: userCreated.accountId }
      });

      if (!userExists) {
        console.error(`❌ Usuario con accountId ${userCreated.accountId} NO EXISTE en la BD`);
        continue;
      }

      // Para cada ejercicio, crear medidas para todos los 5 huesos
      for (const [csvExName, dbExName] of Object.entries(exerciseMapping)) {
        const exercise = exercisesByName[dbExName];
        if (!exercise) {
          console.log(`⚠️  Ejercicio "${dbExName}" no encontrado en la base de datos`);
          continue;
        }

        // Para cada hueso
        for (const boneDef of boneDefinitions) {
          const realValue = parseFloat(row[boneDef.columnReal]);
          
          // Validar realValue con más detalle
          if (isNaN(realValue)) {
            console.log(`⚠️  Usuario ${row.user_id}, Ejercicio ${dbExName}, Hueso ${boneDef.name}: realValue es NaN (columna: ${boneDef.columnReal}, valor: ${row[boneDef.columnReal]})`);
            measuresFailed++;
            continue;
          }
          
          if (realValue <= 0 || realValue > 999.99) {
            console.log(`⚠️  Usuario ${row.user_id}, Ejercicio ${dbExName}, Hueso ${boneDef.name}: realValue fuera de rango (${realValue})`);
            measuresFailed++;
            continue;
          }
          
          // Buscar la columna ideal específica para este ejercicio y hueso
          const idealColumnName = `ideal_${csvExName}_${boneDef.csvName}_cm`;
          const idealValue = parseFloat(row[idealColumnName]);
          
          // Validar idealValue con más detalle
          if (isNaN(idealValue)) {
            console.log(`⚠️  Usuario ${row.user_id}, Ejercicio ${dbExName}, Hueso ${boneDef.name}: idealValue es NaN (columna: ${idealColumnName}, valor: ${row[idealColumnName]})`);
            measuresFailed++;
            continue;
          }
          
          if (idealValue <= 0 || idealValue > 999.99) {
            console.log(`⚠️  Usuario ${row.user_id}, Ejercicio ${dbExName}, Hueso ${boneDef.name}: idealValue fuera de rango (${idealValue})`);
            measuresFailed++;
            continue;
          }

          try {
            // Verificar que las foreign keys existen
            const boneExists = await BoneModel.findByPk(bones[boneDef.name].id);
            const exerciseExists = await ExerciseModel.findByPk(exercise.id);
            
            if (!boneExists) {
              console.error(`❌ Hueso con id ${bones[boneDef.name].id} NO EXISTE en la BD`);
              measuresFailed++;
              continue;
            }
            
            if (!exerciseExists) {
              console.error(`❌ Ejercicio con id ${exercise.id} NO EXISTE en la BD`);
              measuresFailed++;
              continue;
            }

            // Intentar crear con validación explícita
            const measureData = {
              userId: userCreated.accountId,
              boneId: bones[boneDef.name].id,
              exerciseId: exercise.id,
              real: realValue,
              ideal: idealValue
            };

            // Validar que todos los campos requeridos están presentes
            if (!measureData.userId || !measureData.boneId || !measureData.exerciseId) {
              console.error(`❌ Datos incompletos:`, measureData);
              measuresFailed++;
              continue;
            }

            // Usar findOrCreate para evitar duplicados
            const [measure, created] = await BoneMeasuresUserModel.findOrCreate({
              where: {
                userId: measureData.userId,
                boneId: measureData.boneId,
                exerciseId: measureData.exerciseId
              },
              defaults: {
                real: measureData.real,
                ideal: measureData.ideal
              }
            });

            if (created) {
              measuresCreated++;
            } else {
              await measure.update({
                real: measureData.real,
                ideal: measureData.ideal
              });
              measuresUpdated++;
            }
          } catch (error) {
            measuresFailed++;
            console.error(`❌ ERROR DETALLADO - Usuario ${row.user_id}, Ejercicio ${dbExName}, Hueso ${boneDef.name}:`);
            console.error(`   Mensaje: ${error.message}`);
            console.error(`   Nombre: ${error.name}`);
            console.error(`   userId: ${userCreated.accountId} (type: ${typeof userCreated.accountId})`);
            console.error(`   boneId: ${bones[boneDef.name].id} (type: ${typeof bones[boneDef.name].id})`);
            console.error(`   exerciseId: ${exercise.id} (type: ${typeof exercise.id})`);
            console.error(`   real: ${realValue} (type: ${typeof realValue})`);
            console.error(`   ideal: ${idealValue} (type: ${typeof idealValue})`);
            
            // Imprimir el error completo de Sequelize si existe
            if (error.errors) {
              console.error(`   Errores de validación de Sequelize:`);
              error.errors.forEach(err => {
                console.error(`      - ${err.path}: ${err.message} (type: ${err.type})`);
              });
            }
          }
        }
      }

      console.log(`✅ Medidas procesadas para usuario ${row.user_id}`);
    } catch (error) {
      console.error(`❌ Error procesando medidas para usuario ${row.user_id}:`, error.message);
    }
  }

  console.log(`\n📊 Medidas creadas: ${measuresCreated}`);
  console.log(`📊 Medidas actualizadas: ${measuresUpdated}`);
  console.log(`📊 Medidas fallidas: ${measuresFailed}`);
  console.log(`📊 Total esperado: ${usersCreated.length} usuarios × ${Object.keys(exerciseMapping).length} ejercicios × 5 huesos = ${usersCreated.length * Object.keys(exerciseMapping).length * 5}`);
  return measuresCreated + measuresUpdated;
};

// Función para crear ejercicios únicos
const createExercises = async (trainingData) => {
  console.log('\n🏋️  Creando ejercicios únicos...');
  const exerciseMap = new Map();

  // Recopilar ejercicios únicos
  for (const row of trainingData) {
    if (row.nombre_ejercicio && !exerciseMap.has(row.nombre_ejercicio)) {
      exerciseMap.set(row.nombre_ejercicio, {
        name: row.nombre_ejercicio,
        type: row.tipo_ejercicio || 'general'
      });
    }
  }

  const exercisesCreated = [];
  for (const [name, data] of exerciseMap.entries()) {
    try {
      const [exercise, created] = await ExerciseModel.findOrCreate({
        where: { name: data.name },
        defaults: {
          name: data.name,
          description: `Ejercicio de ${data.type}`,
          type: data.type
        }
      });

      if (created) {
        console.log(`✅ Ejercicio "${name}" creado`);
      } else {
        console.log(`⏭️  Ejercicio "${name}" ya existe`);
      }
      exercisesCreated.push(exercise);
    } catch (error) {
      console.error(`❌ Error creando ejercicio "${name}":`, error.message);
    }
  }

  return exercisesCreated;
};

// Función para crear series desde los datos de entrenamiento histórico
const createTrainingSeriesFromHistory = async (trainingData, usersCreated) => {
  console.log('\n📈 Creando series desde datos históricos de entrenamiento...');
  
  // Buscar o crear un trainer por defecto una sola vez
  let defaultTrainerId;
  const trainerAccount = await AccountModel.findOne({
    where: { email: 'trainer@example.com' }
  });
  
  if (trainerAccount) {
    defaultTrainerId = trainerAccount.id;
    console.log('✅ Usando entrenador por defecto: trainer@example.com');
  } else {
    // Crear trainer si no existe
    console.log('⚠️  Creando entrenador por defecto para datos históricos...');
    const hashedPassword = await argon2.hash('trainerETL123');
    const newTrainer = await AccountModel.create({
      email: 'trainer-etl@hammergym.com',
      username: 'TrainerETL',
      password: hashedPassword
    });
    defaultTrainerId = newTrainer.id;
    console.log('✅ Entrenador ETL creado: trainer-etl@hammergym.com');
  }

  // Crear registros Training para cada usuario (necesario para TrainingDay)
  console.log('🔗 Creando registros Training para usuarios...');
  for (const user of usersCreated) {
    try {
      await TrainingModel.findOrCreate({
        where: {
          userId: user.accountId,
          trainerId: defaultTrainerId
        },
        defaults: {
          userId: user.accountId,
          trainerId: defaultTrainerId
        }
      });
    } catch (error) {
      console.error(`❌ Error creando Training para usuario ${user.userId}:`, error.message);
    }
  }
  console.log('✅ Registros Training creados');
  
  let seriesCreated = 0;
  let seriesSkipped = 0;
  let trainingDaysCreated = 0;
  
  // Agrupar datos por usuario, fecha y ejercicio
  const groupedData = {};
  
  for (const row of trainingData) {
    const key = `${row.id_usuario}_${row.fecha_entrenamiento}_${row.nombre_ejercicio}`;
    if (!groupedData[key]) {
      groupedData[key] = {
        userId: row.id_usuario,
        date: row.fecha_entrenamiento,
        exerciseName: row.nombre_ejercicio,
        series: []
      };
    }
    
    // Guardar info de la serie
    groupedData[key].series.push({
      weight: row.peso_kg,
      reps: row.repeticiones,
      numSeries: row.series, // Número de series a crear
      sensation: row.sensacion_post_ejercicio,
      injured: row.lesionado === 'true' || row.lesionado === true
    });
  }

  console.log(`📊 Total de entrenamientos agrupados: ${Object.keys(groupedData).length}`);

  // Crear TrainingDays y Series para cada grupo
  for (const [key, data] of Object.entries(groupedData)) {
    try {
      // Buscar el accountId del usuario
      const userCreated = usersCreated.find(u => u.userId === data.userId);
      if (!userCreated) {
        console.log(`⏭️  Usuario ${data.userId} no encontrado, saltando...`);
        seriesSkipped += data.series.length;
        continue;
      }

      // Buscar el ejercicio
      const exercise = await ExerciseModel.findOne({
        where: { name: data.exerciseName }
      });

      if (!exercise) {
        console.log(`⏭️  Ejercicio "${data.exerciseName}" no encontrado, saltando...`);
        seriesSkipped += data.series.length;
        continue;
      }

      // Crear o encontrar TrainingDay para esta fecha
      const [trainingDay, created] = await TrainingDayModel.findOrCreate({
        where: {
          userId: userCreated.accountId,
          date: new Date(data.date)
        },
        defaults: {
          userId: userCreated.accountId,
          trainerId: defaultTrainerId,
          date: new Date(data.date)
        }
      });

      if (created) {
        trainingDaysCreated++;
      }

      // Crear las series para este ejercicio
      for (const serieInfo of data.series) {
        const numSeries = parseInt(serieInfo.numSeries) || 1;
        
        // Crear múltiples series si el CSV indica más de una
        for (let i = 0; i < numSeries; i++) {
          try {
            await SerieModel.create({
              idTrainingDay: trainingDay.id,
              idExercise: exercise.id,
              reps: parseInt(serieInfo.reps) || 0,
              weigth: parseFloat(serieInfo.weight) || 0,
              sensations: serieInfo.sensation ? parseInt(serieInfo.sensation) : null,
              injured: serieInfo.injured
            });
            seriesCreated++;
          } catch (error) {
            console.error(`❌ Error creando serie:`, error.message);
            seriesSkipped++;
          }
        }
      }

    } catch (error) {
      console.error(`❌ Error procesando grupo ${key}:`, error.message);
      seriesSkipped += data.series.length;
    }
  }

  console.log(`✅ TrainingDays creados: ${trainingDaysCreated}`);
  console.log(`✅ Series creadas: ${seriesCreated}`);
  console.log(`⚠️  Series saltadas: ${seriesSkipped}`);
  
  return { trainingDaysCreated, seriesCreated, seriesSkipped };
};

// Función principal ETL
export const runETL = async () => {
  try {
    console.log('\n🚀 ==========================================');
    console.log('🚀 Iniciando proceso ETL...');
    console.log('🚀 ==========================================');

    // Rutas de los archivos CSV
    // Usar rutas relativas desde la raíz del proyecto backend
    const measuresPath = path.join(__dirname, '../../../Dataset med_os comp (1).csv');
    const trainingPath = path.join(__dirname, '../../../progresion_entrenamiento_usuario (4).csv');

    console.log('📂 Rutas de archivos CSV:');
    console.log(`   Medidas: ${measuresPath}`);
    console.log(`   Entrenamiento: ${trainingPath}`);

    // Verificar que los archivos existen
    if (!fs.existsSync(measuresPath)) {
      console.log('⚠️  Archivo de medidas no encontrado, saltando ETL de usuarios');
      console.log(`   Ruta buscada: ${measuresPath}`);
      return;
    }

    if (!fs.existsSync(trainingPath)) {
      console.log('⚠️  Archivo de entrenamiento no encontrado, saltando ETL de ejercicios');
      console.log(`   Ruta buscada: ${trainingPath}`);
      return;
    }

    // Leer CSVs
    console.log('\n📂 Leyendo archivos CSV...');
    const measuresData = await readCSV(measuresPath);
    const trainingData = await readCSV(trainingPath);
    
    console.log(`📊 Registros de medidas: ${measuresData.length}`);
    console.log(`📊 Registros de entrenamiento: ${trainingData.length}`);

    // Paso 1: Crear usuarios
    console.log('\n' + '='.repeat(50));
    console.log('PASO 1: CREANDO USUARIOS');
    console.log('='.repeat(50));
    const users = await createUsersFromMeasures(measuresData);
    console.log(`\n📊 Resumen: ${users.length} usuarios procesados`);

    // Paso 2: Crear ejercicios (ANTES de las medidas, porque las medidas necesitan los IDs de ejercicios)
    console.log('\n' + '='.repeat(50));
    console.log('PASO 2: CREANDO EJERCICIOS');
    console.log('='.repeat(50));
    const exercises = await createExercises(trainingData);
    console.log(`\n📊 Resumen: ${exercises.length} ejercicios procesados`);

    // Paso 3: Crear huesos y medidas de usuario por ejercicio
    console.log('\n' + '='.repeat(50));
    console.log('PASO 3: CREANDO HUESOS Y MEDIDAS POR EJERCICIO');
    console.log('='.repeat(50));
    const measuresCount = await createBonesAndMeasures(measuresData, users);
    console.log(`\n📊 Resumen: ${measuresCount} medidas creadas`);

    // Paso 4: Crear series desde datos históricos
    console.log('\n' + '='.repeat(50));
    console.log('PASO 4: CREANDO SERIES DESDE DATOS HISTÓRICOS');
    console.log('='.repeat(50));
    const seriesResult = await createTrainingSeriesFromHistory(trainingData, users);

    console.log('\n✅ ==========================================');
    console.log('✅ PROCESO ETL COMPLETADO EXITOSAMENTE');
    console.log('✅ ==========================================');
    console.log('\n📊 RESUMEN FINAL:');
    console.log(`   - Usuarios creados: ${users.length}`);
    console.log(`   - Huesos creados: 5 (femur, tibia, humerus, radius, torso)`);
    console.log(`   - Medidas de huesos creadas: ${measuresCount}`);
    console.log(`   - Ejercicios creados: ${exercises.length}`);
    console.log(`   - TrainingDays creados: ${seriesResult.trainingDaysCreated}`);
    console.log(`   - Series creadas: ${seriesResult.seriesCreated}`);
    console.log(`   - Series saltadas: ${seriesResult.seriesSkipped}`);
    console.log('\n✅ Los datos históricos de entrenamiento han sido importados exitosamente!\n');

    return {
      success: true,
      users: users.length,
      boneMeasures: measuresCount,
      exercises: exercises.length,
      trainingDays: seriesResult.trainingDaysCreated,
      series: seriesResult.seriesCreated
    };

  } catch (error) {
    console.error('\n❌ ==========================================');
    console.error('❌ ERROR EN PROCESO ETL');
    console.error('❌ ==========================================');
    console.error(error);
    throw error;
  }
};

export default runETL;
