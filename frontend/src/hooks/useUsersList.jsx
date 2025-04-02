import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrainerAssignedUsers } from '../services/TrainerService.js';

const useUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getTrainerAssignedUsers();

        if (!response.success) {
          setError(response.message || 'Failed to load users');
          return;
        }
        setUsers(response.users);

      }
      catch (err) {
        setError('Error connecting to server');
      }
      finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateTraining = () => {
    navigate('/entrenador/crear-plan');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return { users, loading, error, handleCreateTraining, formatDate };
}

export default useUsersList;