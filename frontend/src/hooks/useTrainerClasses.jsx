import { useState, useEffect } from 'react';
import { getTrainerClasses } from '../services/classService';

const useTrainerClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getTrainerClasses();

      if (!response.success) {
        setError('Failed to fetch trainer classes');
        return false;
      }

      setClasses(response.classes);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    setClasses,
    loading,
    error,
    refetch: fetchClasses
  };
};

export default useTrainerClasses;