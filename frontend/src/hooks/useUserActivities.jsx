import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUserActivities } from '../services/UserService';

export const TIME_FILTERS = {
  MONTH: 'month',
  WEEK: 'week'
};

const useUserActivities = () => {
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS.MONTH);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);

  const loadActivities = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await getUserActivities();

      if (response.success) {
        const sortedActivities = response.activities.sort((a, b) =>
          new Date(b.dateTime) - new Date(a.dateTime)
        );
        setActivities(sortedActivities);
        setError(null);

        if (sortedActivities.length > 0) {
          const mostRecentDate = new Date(sortedActivities[0].dateTime);
          setExpandedDay(mostRecentDate.toDateString());
        }
      } else {
        setError(response.message || 'No se pudieron cargar las actividades');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error al cargar actividades:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case TIME_FILTERS.WEEK:
        filterDate.setDate(now.getDate() - 7);
        break;
      case TIME_FILTERS.MONTH:
      default:
        filterDate.setDate(now.getDate() - 30);
        break;
    }

    return activities.filter(activity => {
      const activityDate = new Date(activity.dateTime);
      return activityDate >= filterDate;
    });
  }, [activities, timeFilter]);

  const groupedActivities = useMemo(() => {
    const grouped = {};

    filteredActivities.forEach(activity => {
      const date = new Date(activity.dateTime);
      const dateString = date.toDateString();

      if (!grouped[dateString]) {
        grouped[dateString] = {
          date,
          activities: []
        };
      }

      grouped[dateString].activities.push(activity);
    });

    return Object.values(grouped).sort((a, b) => b.date - a.date);
  }, [filteredActivities]);

  const toggleDay = useCallback((dateString) => {
    setExpandedDay(prev => prev === dateString ? null : dateString);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setTimeFilter(filter);
  }, []);

  return {
    filteredActivities,
    groupedActivities,
    loading,
    refreshing,
    error,
    timeFilter,
    expandedDay,
    loadActivities,
    toggleDay,
    handleFilterChange,
    TIME_FILTERS
  };
};

export default useUserActivities;