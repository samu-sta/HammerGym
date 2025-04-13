import { useState } from 'react';
import { enrollInClass, unenrollFromClass } from '../services/classService';

const useClassEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const enroll = async (classId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await enrollInClass(classId);

      if (response) {
        setSuccess(true);
        return true;
      } else {
        setError(response.message || 'Error al inscribirse en la clase');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Error al inscribirse en la clase');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unenroll = async (classId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await unenrollFromClass(classId);

      if (response) {
        setSuccess(true);
        return true;
      } else {
        setError('Error al cancelar la inscripción');
        return false;
      }
    } catch (err) {
      setError('Error al cancelar la inscripción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    enroll,
    unenroll,
    loading,
    error,
    success
  };
};

export default useClassEnrollment;