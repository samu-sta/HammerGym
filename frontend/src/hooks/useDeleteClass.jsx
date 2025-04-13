import { useState } from 'react';
import { deleteClass } from '../services/classService';

/**
 * Hook personalizado para manejar la eliminación de clases
 */
const useDeleteClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Maneja la eliminación de una clase
   * @param {string} classId - ID de la clase a eliminar
   * @param {Function} updateClassesCallback - Función para actualizar el estado de las clases después de eliminar
   */
  const handleDeleteClass = async (classId, updateClassesCallback) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await deleteClass(classId);

      if (!response.success) {
        setError(response.message || 'Error al eliminar la clase');
        return false;
      }

      // Si la eliminación fue exitosa, actualizar el estado local
      if (updateClassesCallback && typeof updateClassesCallback === 'function') {
        updateClassesCallback(classId);
      }

      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error al eliminar la clase');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteClass: handleDeleteClass,
    loading,
    error,
    success,
    setError,
    setSuccess
  };
};

export default useDeleteClass;