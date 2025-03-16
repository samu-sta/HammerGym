import cuentaDAO from '../DAO/cuentaDAO.js';
import bcrypt from 'bcrypt'; // Asegúrate de instalar bcrypt: npm install bcrypt

class CuentaController {
    async crearCuenta(req, res) {
        try {
            const { password, login } = req.body;
            
            if (!password || !login) {
                return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
            }
            
            const cuentaExistente = await cuentaDAO.encontrarPorLogin(login);
            if (cuentaExistente) {
                return res.status(400).json({ mensaje: 'El login ya está en uso' });
            }
            
            const passwordHash = await bcrypt.hash(password, 10);
            
            const cuentaData = {
                password: passwordHash,
                login: login,
                fechaActivacion: new Date()
            };
            
            const nuevaCuenta = await cuentaDAO.crear(cuentaData);
            
            const { password: _, ...cuentaResponse } = nuevaCuenta.toJSON();
            
            res.status(201).json(cuentaResponse);
        } catch (error) {
            console.error('Error al crear cuenta:', error);
            res.status(500).json({ mensaje: 'Error al crear la cuenta', error: error.message });
        }
    }

    

    // Otros métodos del controlador...
}

export default new CuentaController();