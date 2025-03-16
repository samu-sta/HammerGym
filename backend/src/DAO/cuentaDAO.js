import Cuenta from '../models/Cuenta.js';

class CuentaDAO {

    async crear(cuentaData) {
        try {
            return await Cuenta.create(cuentaData);
        } catch (error) {
            console.error('Error al crear cuenta:', error);
            throw error;
        }
    }

    async encontrarPorId(id) {
        try {
            return await Cuenta.findByPk(id);
        } catch (error) {
            console.error(`Error al buscar cuenta con id ${id}:`, error);
            throw error;
        }
    }

    async encontrarPorLogin(login) {
        try {
            return await Cuenta.findOne({ where: { login } });
        } catch (error) {
            console.error(`Error al buscar cuenta con login ${login}:`, error);
            throw error;
        }
    }

    async actualizar(id, cuentaData) {
        try {
            const [filasActualizadas] = await Cuenta.update(cuentaData, {
                where: { idCuenta: id }
            });
            return filasActualizadas > 0;
        } catch (error) {
            console.error(`Error al actualizar cuenta ${id}:`, error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            const filasEliminadas = await Cuenta.destroy({
                where: { idCuenta: id }
            });
            return filasEliminadas > 0;
        } catch (error) {
            console.error(`Error al eliminar cuenta ${id}:`, error);
            throw error;
        }
    }

    async listarTodos() {
        try {
            return await Cuenta.findAll();
        } catch (error) {
            console.error('Error al listar cuentas:', error);
            throw error;
        }
    }
}

export default new CuentaDAO();