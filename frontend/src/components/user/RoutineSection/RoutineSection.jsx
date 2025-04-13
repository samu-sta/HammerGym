import React from 'react';
import './styles/RoutineSection.css';
import { useIsMobile } from '../../../hooks/useWindowSize';
import { LoadingState, ErrorState, EmptyState } from './components/StatusStates';
import HeaderTraining from './components/HeaderTraining';
import ExerciseList from './components/ExerciseList';
import useRoutineTraining from '../../../hooks/useRoutineTraining';

const mobileSize = 768;

const RoutineSection = () => {
  const isMobile = useIsMobile({ mobileSize });
  const {
    training,
    loading,
    error,
    refetch,
    selectedDay,
    setSelectedDay,
    hasExercises,
    hasDayTraining,
    getSelectedDayExercises
  } = useRoutineTraining();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!training || !training.days || Object.keys(training.days).length === 0) {
    return <EmptyState />;
  }

  return (
    <section className={`user-routine ${isMobile ? 'mobile' : ''}`}>
      <HeaderTraining
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        days={training.days}
        hasDayTraining={hasDayTraining}
        isMobile={isMobile}
      />

      <ExerciseList
        exercises={getSelectedDayExercises()}
        hasExercises={hasExercises()}
        selectedDay={selectedDay}
      />
    </section>
  );
};

export default RoutineSection;