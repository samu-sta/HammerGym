import { useState, useCallback, useEffect } from 'react';
import {
  getClassAttendance,
  submitClassAttendance
} from '../services/classService';
import {
  getTodayDate,
  filterAttendingUsers,
  validateAttendanceDate
} from '../utils/classUtils';

const useAttendance = (classId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [attendingUsers, setAttendingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [classData, setClassData] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const toggleUserAttendance = useCallback((username) => {
    setAttendingUsers(prevUsers =>
      prevUsers.some(user => user.username === username)
        ? prevUsers.filter(user => user.username !== username)
        : [...prevUsers, { username }]
    );
  }, []);

  const loadClassData = useCallback(async (date = selectedDate) => {
    if (!classId) return null;

    setLoading(true);
    setError(null);

    try {
      const data = await getClassAttendance(classId, date);

      if (!data.success && data.message) {
        setError(data.message);
        return null;
      }

      const retrievedClassData = data.class;
      setClassData(retrievedClassData);

      if (retrievedClassData) {
        const validationResult = validateAttendanceDate(date, retrievedClassData);
        setDateError(validationResult.valid ? null : validationResult.message);
      }

      const classUsers = data.users || [];
      setUsers(classUsers);

      setAttendingUsers(filterAttendingUsers(classUsers));

      return { classData: retrievedClassData, users: classUsers };
    } catch (err) {
      setError('Error al cargar los datos de la clase');
      return null;
    } finally {
      setLoading(false);
    }
  }, [classId, selectedDate]);

  const submitAttendance = useCallback(async (date = selectedDate) => {
    if (!classId) return false;

    setSuccess(false);
    setLoading(true);
    setError(null);

    try {
      const result = await submitClassAttendance(classId, attendingUsers, date);

      if (result.success) {
        setSuccess(true);
        return true;
      } else {
        setError(result.message || 'Error al registrar la asistencia');
        return false;
      }
    } catch (error) {
      setError('Error al procesar la solicitud');
      return false;
    } finally {
      setLoading(false);
    }
  }, [classId, attendingUsers, selectedDate]);

  const changeSelectedDate = useCallback((date) => {
    setSelectedDate(date);
    setDateError(null);
  }, []);

  const resetAttendance = useCallback(() => {
    setAttendingUsers([]);
    setUsers([]);
    setClassData(null);
    setError(null);
    setDateError(null);
    setSuccess(false);
  }, []);

  useEffect(() => {
    if (classId) {
      loadClassData(selectedDate);
    }

    return () => resetAttendance();
  }, [classId, selectedDate, loadClassData, resetAttendance]);

  return {
    loading,
    error,
    dateError,
    success,
    attendingUsers,
    users,
    classData,
    selectedDate,

    toggleUserAttendance,
    submitAttendance,
    loadClassData,
    changeSelectedDate,
    resetAttendance,
    setDateError
  };
};

export default useAttendance;