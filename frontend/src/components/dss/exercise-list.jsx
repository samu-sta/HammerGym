import { useState } from "react"
import { Card } from "@/components/dss/ui/card"
import { Checkbox } from "@/components/dss/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dss/ui/select"
import { Filter } from "lucide-react"
import { mockExercises } from "@/data/dss-exercises"
import { getScoreColor } from "@/utils/dss-calculations"
import { EXERCISE_TYPES, MAX_SELECTED_EXERCISES } from "@/constants/dss-config"

export function ExerciseList({ onSelectionChange }) {
  const [selectedExercises, setSelectedExercises] = useState([])
  const [filterType, setFilterType] = useState(EXERCISE_TYPES[0])

  const filteredExercises = mockExercises.filter((ex) => ex.type === filterType)

  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType)
    // Clear selection when changing exercise type
    setSelectedExercises([])
    onSelectionChange([])
  }

  const toggleExercise = (id) => {
    const newSelection = selectedExercises.includes(id)
      ? selectedExercises.filter((exId) => exId !== id)
      : selectedExercises.length < MAX_SELECTED_EXERCISES
        ? [...selectedExercises, id]
        : selectedExercises

    setSelectedExercises(newSelection)
    onSelectionChange(newSelection)
  }

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Lista de Ejercicios</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Filtrar tipo" />
            </SelectTrigger>
            <SelectContent>
              {EXERCISE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Headers */}
      <div className="flex items-center gap-3 px-2 pb-2 mb-2 border-b border-border">
        <p className="flex-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Ejercicio</p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <p className="w-32 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Índice Afinidad
          </p>
          <p className="w-32 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Eficiencia Biomecánica
          </p>
          <div className="w-5" /> {/* Spacer for checkbox */}
        </div>
      </div>

      <div className="space-y-1">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => toggleExercise(exercise.id)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              selectedExercises.includes(exercise.id) ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{exercise.name}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <p className={`w-32 text-center text-sm font-bold ${getScoreColor(exercise.affinityIndex)}`}>
                {exercise.affinityIndex.toFixed(1)}
              </p>
              <p className={`w-32 text-center text-sm font-bold ${getScoreColor(exercise.biomechanicalEfficiency)}`}>
                {exercise.biomechanicalEfficiency.toFixed(1)}
              </p>
              <Checkbox checked={selectedExercises.includes(exercise.id)} className="pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {selectedExercises.length === MAX_SELECTED_EXERCISES && (
        <p className="text-xs text-warning mt-2">Máximo {MAX_SELECTED_EXERCISES} ejercicios seleccionados</p>
      )}
    </Card>
  )
}
