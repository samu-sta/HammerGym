import { useState, useEffect } from 'react';
import { getUserProgressByEmail } from '../services/TrainerService';

const useUserProgress = (userEmail) => {
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUserProgressByEmail(userEmail);
        console.log(response);

        if (response.success) {
          setUserData(response.data);

          const sortedData = [...response.data].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
          );

          setProgressData(sortedData);
        } else {
          setError(response.message || 'No se pudo cargar el progreso del usuario');
        }
      } catch (err) {
        console.error('Error al cargar el progreso:', err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserProgress();
    }
  }, [userEmail]);

  return { userData, progressData, loading, error };
};

export default useUserProgress;