# HammerGym - Sistema de Gestión de Gimnasios

## 📋 Descripción
Sistema de información web para la gestión integral de una cadena de gimnasios.

## Diagrama de Gantt

![Screenshot from 2025-03-15 15-56-27](https://github.com/user-attachments/assets/45884a5f-aab6-48e0-83b9-d00774baf2c9)
![Screenshot from 2025-03-15 15-56-42](https://github.com/user-attachments/assets/1e61f012-372d-4a2d-9fa2-f1209d3cc755)
![Screenshot from 2025-03-15 15-56-57](https://github.com/user-attachments/assets/6ad3b5b9-c3ee-416f-a185-c377a11f8850)





## 🚀 Características Principales

- Gestión de miembros
- Programación de clases
- Control de inventario de equipos
- Administración de personal
- Planes de membresía y pagos
- Métricas de rendimiento
- Planes de entrenamiento
- Soporte multi-sucursal

## 🛠️ Tecnologías

- **Frontend:**
  - React 19
  - Vite
  - JavaScript moderno (ES6+)

- **Backend:**
  - Node.js
  - Express.js

## 💻 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/hammergym.git

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## ▶️ Ejecución

```bash
# Iniciar servidor backend
cd backend
npm start

# Iniciar servidor frontend
cd frontend
npm run dev
```

## 🐳 Docker

```bash

# Crear el archivo de variables de entorno:
cp .env.example .env

# Construir y levantar todos los contenedores
docker compose up --build

# Para ejecutar en segundo plano
docker compose up -d --build

# Para ver logs cuando se ejecuta en segundo plano
docker compose logs -f
```

## 🔧 Desarrollo

- Frontend corre en: `http://localhost:5173`
- Backend corre en: `http://localhost:3000`

## 📄 Licencia

Licencia MIT

## 🤝 Contribución

1. Haz un Fork del repositorio
2. Crea tu rama de funcionalidad (`git checkout -b feature/NuevaFuncionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

