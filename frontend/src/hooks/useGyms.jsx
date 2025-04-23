import { useState, useEffect } from 'react';
import { fetchAllGymsWithMachines } from '../services/GymService';

const useGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedGym, setExpandedGym] = useState(null);

  useEffect(() => {
    const loadGyms = async () => {
      try {
        setLoading(true);
        const gymsData = await fetchAllGymsWithMachines();
        console.log("Gimnasios con máquinas cargados:", gymsData);
        setGyms(gymsData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los gimnasios. Por favor, inténtelo de nuevo más tarde.');
        console.error('Error cargando gimnasios:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGyms();
  }, []);

  const toggleGymExpansion = (gymId) => {
    if (expandedGym === gymId) {
      setExpandedGym(null);
    } else {
      setExpandedGym(gymId);
    }
  };

  // Función para determinar la clase de ocupación según el porcentaje
  const getOccupancyClass = (current, max) => {
    if (!current || !max || max === 0) return 'occupancy-low';

    const occupancyRate = (current / max) * 100;

    if (occupancyRate < 50) {
      return 'occupancy-low';
    } else if (occupancyRate < 80) {
      return 'occupancy-medium';
    } else {
      return 'occupancy-high';
    }
  };

  return {
    gyms,
    loading,
    error,
    expandedGym,
    toggleGymExpansion,
    getOccupancyClass
  };
};

export default useGyms;