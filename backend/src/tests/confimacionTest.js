import sequelize from "../database/database.js";
import Cuenta from "../models/Cuenta.js";
import Usuario from "../models/Usuario.js";
import Membresia from "../models/Membresia.js";
import Gimnasio from "../models/Gimnasio.js";
import Ejercicio from "../models/Ejercicio.js";
import ModeloMaquina from "../models/modeloMaquina.js";
import TuplaEjMaq from "../models/tuplaEjMquina.js"; // Corregir nombre si es necesario
import { seedDatabase } from "../database/seed.js";
import { Op } from "sequelize"; // Añadir para usar operadores
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Define las asociaciones entre modelos (necesario para los JOINs)
function setupAssociations() {
  // Asociaciones Cuenta-Usuario
  Cuenta.hasOne(Usuario, { foreignKey: 'idCuenta' });
  Usuario.belongsTo(Cuenta, { foreignKey: 'idCuenta' });

  // Asociaciones Ejercicio-ModeloMaquina (muchos a muchos)
  Ejercicio.belongsToMany(ModeloMaquina, { 
    through: TuplaEjMaq,
    foreignKey: 'idEjercicio'
  });

  ModeloMaquina.belongsToMany(Ejercicio, { 
    through: TuplaEjMaq,
    foreignKey: 'idmodeloMaquina'
  });
}

// Función para probar las consultas
async function testQueries() {
  try {
    console.log("🔍 Probando consultas en la base de datos");

    // 1. Contar registros en cada tabla
    const cuentasCount = await Cuenta.count();
    const usuariosCount = await Usuario.count();
    const membresiasCount = await Membresia.count();
    const gimnasiosCount = await Gimnasio.count();
    const ejerciciosCount = await Ejercicio.count();
    const maquinasCount = await ModeloMaquina.count();
    
    console.log("📊 Resumen de registros:");
    console.log(`   - Cuentas: ${cuentasCount}`);
    console.log(`   - Usuarios: ${usuariosCount}`);
    console.log(`   - Membresías: ${membresiasCount}`);
    console.log(`   - Gimnasios: ${gimnasiosCount}`);
    console.log(`   - Ejercicios: ${ejerciciosCount}`);
    console.log(`   - Modelos de máquinas: ${maquinasCount}`);
    
    // 2. Consulta con JOIN: ejercicios con sus máquinas asociadas
    const ejerciciosConMaquinas = await Ejercicio.findAll({
      include: [{
        model: ModeloMaquina,
        through: TuplaEjMaq,
      }],
    });
    
    console.log("\n🏋️ Ejercicios con máquinas asociadas:");
    ejerciciosConMaquinas.forEach(ejercicio => {
      console.log(`   - ${ejercicio.nombre} (${ejercicio.musculo})`);
      if (ejercicio.ModeloMaquinas && ejercicio.ModeloMaquinas.length > 0) {
        ejercicio.ModeloMaquinas.forEach(maquina => {
          console.log(`     * ${maquina.nombre} (${maquina.marca})`);
        });
      } else {
        console.log("     * No tiene máquinas asociadas");
      }
    });
    
    // 3. Consulta con WHERE: usuarios con peso > 75
    const usuariosPesados = await Usuario.findAll({
      where: {
        peso: {
          [Op.gt]: 75 // Operador "mayor que"
        }
      },
      include: [{
        model: Cuenta,
      }]
    });
    
    console.log("\n⚖️ Usuarios con peso > 75kg:");
    if (usuariosPesados.length === 0) {
      console.log("   No se encontraron usuarios con peso > 75kg");
    } else {
      usuariosPesados.forEach(usuario => {
        console.log(`   - ID: ${usuario.idUsuario}, Peso: ${usuario.peso}kg, Login: ${usuario.Cuenta ? usuario.Cuenta.login : 'N/A'}`);
      });
    }
    
    // 4. Consulta de agregación: promedio de precios de membresías
    const avgPrecio = await Membresia.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('precio')), 'promedioPrecio']
      ]
    });
    
    console.log(`\n💰 Precio promedio de membresías: ${parseFloat(avgPrecio.getDataValue('promedioPrecio')).toFixed(2)}€`);
    
    // 5. Consulta con GROUP BY: número de ejercicios por músculo
    const ejerciciosPorMusculo = await Ejercicio.findAll({
      attributes: [
        'musculo',
        [sequelize.fn('COUNT', sequelize.col('idEjercicio')), 'cantidad']
      ],
      group: ['musculo']
    });
    
    console.log("\n💪 Distribución de ejercicios por músculo:");
    if (ejerciciosPorMusculo.length === 0) {
      console.log("   No se encontraron ejercicios");
    } else {
      ejerciciosPorMusculo.forEach(grupo => {
        console.log(`   - ${grupo.musculo}: ${grupo.getDataValue('cantidad')} ejercicios`);
      });
    }

    console.log("\n✅ Pruebas de consulta completadas");
    return true;
  } catch (error) {
    console.error("❌ Error durante las pruebas:", error);
    console.error(error.stack);
    return false;
  }
}

// Función principal de prueba
async function runTests() {
  try {
    // 1. Verificar conexión
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente");
    
    // Configurar asociaciones
    setupAssociations();
    console.log("✅ Asociaciones entre modelos configuradas");
    
    // 2. Preguntar si quiere resetear y sembrar la base de datos
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('¿Deseas resetear y sembrar la base de datos? (s/n): ', async (answer) => {
      readline.close();
      
      if (answer.toLowerCase() === 's') {
        // Sembrar la base de datos
        console.log("🌱 Sembrando la base de datos...");
        const seedResult = await seedDatabase();
        
        if (!seedResult) {
          console.error("❌ Error al sembrar la base de datos");
          return process.exit(1);
        }
      }
      
      // 3. Ejecutar pruebas de consulta
      await testQueries();
      
      // 4. Cerrar conexión
      await sequelize.close();
      console.log("👋 Conexión cerrada");
      process.exit(0);
    });
    
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar las pruebas
runTests();