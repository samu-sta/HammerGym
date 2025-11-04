/**
 * Get exercise name by ID
 */
export function getExerciseNameById(exercises, id) {
  const exercise = exercises.find(ex => ex.id === id)
  return exercise ? exercise.name : null
}

/**
 * Filter biomechanical data to show only selected exercises
 */
export function filterBiomechanicalData(biomechanicalData, selectedExerciseNames) {
  if (selectedExerciseNames.length === 0) return biomechanicalData

  const filtered = {}
  Object.entries(biomechanicalData).forEach(([bone, data]) => {
    filtered[bone] = data.filter(item => selectedExerciseNames.includes(item.exercise))
  })
  
  return filtered
}

/**
 * Get selected exercise names from IDs
 */
export function getSelectedExerciseNames(exercises, selectedIds) {
  return selectedIds
    .map(id => getExerciseNameById(exercises, id))
    .filter(name => name !== null)
}
