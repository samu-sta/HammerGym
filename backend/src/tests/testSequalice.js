import sequelize from "./database.js";
import Usuario from "../models/Usuario.js";
import Cuenta from "../models/Cuenta.js";
import Membresia from "../models/Membresia.js";
import Gimnasio from "../models/Gimnasio.js";
import Ejercicio from "../models/Ejercicio.js";
import ModeloMaquina from "../models/modeloMaquina.js"; // Asume que has corregido el nombre del archivo
import TuplaEjMaq from "../models/TuplaEjMaq.js"; // Asume que has corregido el nombre del archivo
import bcrypt from "bcrypt";

// Función para hashear contraseñas
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Función principal para sembrar la base de datos
export async function seedDatabase() {
  try {
    // Sincronizar modelos (crea tablas si no existen)
    // ⚠️ Usar force: true solo en desarrollo - eliminará todas las tablas existentes
    await sequelize.sync({ force: true });
    console.log("✅ Base de datos sincronizada");

    // 1. Crear membresías
    const membresias = await Membresia.bulkCreate([
      { precio: 30 }, // Básica
      { precio: 50 }, // Premium
      { precio: 80 }, // VIP
    ]);
    console.log(`✅ Creadas ${membresias.length} membresías`);

    // 2. Crear gimnasios
    const gimnasios = await Gimnasio.bulkCreate([
      {
        ubicacion: "Centro",
        capacidadMaxima: 100,
        afluenciaActual: 35,
      },
      {
        ubicacion: "Norte",
        capacidadMaxima: 150,
        afluenciaActual: 67,
      },
      {
        ubicacion: "Sur",
        capacidadMaxima: 120,
        afluenciaActual: 42,
      },
    ]);
    console.log(`✅ Creados ${gimnasios.length} gimnasios`);

    // 3. Crear cuentas
    const cuentasData = [
      {
        login: "usuario1",
        password: await hashPassword("password123"),
        fechaActivacion: new Date(),
      },
      {
        login: "usuario2",
        password: await hashPassword("password123"),
        fechaActivacion: new Date(),
      },
      {
        login: "admin1",
        password: await hashPassword("admin123"),
        fechaActivacion: new Date(),
      },
    ];

    const cuentas = await Cuenta.bulkCreate(cuentasData);
    console.log(`✅ Creadas ${cuentas.length} cuentas`);

    // 4. Crear usuarios
    const usuariosData = [
      {
        peso: 70.5,
        idCuenta: cuentas[0].idCuenta,
        // otros campos según tu modelo
      },
      {
        peso: 85.2,
        idCuenta: cuentas[1].idCuenta,
        // otros campos según tu modelo
      },
    ];

    const usuarios = await Usuario.bulkCreate(usuariosData);
    console.log(`✅ Creados ${usuarios.length} usuarios`);

    // 5. Crear ejercicios
    const ejercicios = await Ejercicio.bulkCreate([
      { nombre: "Press de banca", musculo: "pecho" },
      { nombre: "Sentadillas", musculo: "piernas" },
      { nombre: "Curl de bíceps", musculo: "biceps" },
      { nombre: "Press militar", musculo: "hombros" },
      { nombre: "Fondos", musculo: "triceps" },
      { nombre: "Remo", musculo: "espalda" },
    ]);
    console.log(`✅ Creados ${ejercicios.length} ejercicios`);

    // 6. Crear modelos de máquinas
    const modelosMaquinas = await ModeloMaquina.bulkCreate([
      { nombre: "Banco plano", marca: "HammerStrength" },
      { nombre: "Prensa de piernas", marca: "Technogym" },
      { nombre: "Polea alta", marca: "Life Fitness" },
      { nombre: "Máquina de curl", marca: "Nautilus" },
    ]);
    console.log(`✅ Creados ${modelosMaquinas.length} modelos de máquinas`);

    // 7. Crear relaciones entre ejercicios y máquinas
    const tuplasEjMaq = await TuplaEjMaq.bulkCreate([
      { 
        idEjercicio: ejercicios[0].idEjercicio, 
        idmodeloMaquina: modelosMaquinas[0].idmodeloMaquina 
      },
      { 
        idEjercicio: ejercicios[1].idEjercicio, 
        idmodeloMaquina: modelosMaquinas[1].idmodeloMaquina 
      },
      { 
        idEjercicio: ejercicios[2].idEjercicio, 
        idmodeloMaquina: modelosMaquinas[3].idmodeloMaquina 
      },
    ]);
    console.log(`✅ Creadas ${tuplasEjMaq.length} relaciones ejercicio-máquina`);

    console.log("✅ Base de datos sembrada exitosamente");
    return true;
  } catch (error) {
    console.error("❌ Error sembrando la base de datos:", error);
    return false;
  }
}

// Si este archivo se ejecuta directamente (no importado)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  // Conectar y sembrar la base de datos
  seedDatabase()
    .then(() => {
      console.log("✅ Proceso completado");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Error en el proceso:", error);
      process.exit(1);
    });
}