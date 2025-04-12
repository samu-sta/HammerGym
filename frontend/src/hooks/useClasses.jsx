import { useState, useEffect } from 'react';
import { getAllClasses, getUserClasses } from '../services/classService';

const useClasses = (type = 'all') => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const fetchFunction = type === 'user' ? getUserClasses : getAllClasses;
        const response = await fetchFunction();

        if (response.success) {
          setClasses(response.classes);
        } else {
          setError('Failed to fetch classes');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [type]);

  return { classes, loading, error };
};

export default useClasses;