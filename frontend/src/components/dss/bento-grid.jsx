import { useState, useEffect } from "react"
import { Card } from "@/components/dss/ui/card"
import { Checkbox } from "@/components/dss/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dss/ui/select"
import { Heart, User, FileText, Filter } from "lucide-react"
import { mockExercises } from "@/data/dss-exercises"
import { MAX_SELECTED_EXERCISES, EXERCISE_TYPES } from "@/constants/dss-config"
import { getMetabolicRisk, getScoreColor, calculateWaistRatio } from "@/utils/dss-calculations"

export function BentoGrid({ onSelectionChange, userData }) {
  const [selectedExercises, setSelectedExercises] = useState([])
  const [filterType, setFilterType] = useState(EXERCISE_TYPES.PUSH)
  
  // Reset selection when user changes
  useEffect(() => {
    setSelectedExercises([])
    setFilterType(EXERCISE_TYPES.PUSH)
  }, [userData.id])

  const waistRatio = calculateWaistRatio(
    userData.metabolicRisk.waistCircumference,
    userData.metabolicRisk.maxWaistCircumference
  )
  const riskStatus = getMetabolicRisk(waistRatio)

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
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:grid-rows-2">
      {/* Riesgo Metabólico - Row 1, Col 1-2 */}
      <Card className="p-4 bg-card border-border lg:col-span-2 lg:row-span-1">
        <header className="flex items-start justify-between">
          <h2 className="text-base text-foreground font-semibold">Riesgo Metabólico</h2>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </header>

        <p className={`text-base font-semibold ${riskStatus.textColor} ${riskStatus.bgColor} px-3 py-2 rounded-lg inline-block mt-3`}>
          {riskStatus.label}{riskStatus.icon}
        </p>

        <dl className="mt-3 pt-3 border-t border-border space-y-1.5">
          <div className="flex justify-between text-xs">
            <dt className="text-muted-foreground">Cintura Real / Máxima</dt>
            <dd className="text-foreground font-medium">
              {userData.metabolicRisk.waistCircumference} / {userData.metabolicRisk.maxWaistCircumference} cm
            </dd>
          </div>
          <div className="flex justify-between text-xs">
            <dt className="text-muted-foreground">Relación</dt>
            <dd className="text-foreground font-medium">{waistRatio.toFixed(2)}</dd>
          </div>
        </dl>
      </Card>

      {/* Variables del Usuario - Row 1, Col 2-3 */}
      <Card className="p-4 bg-card border-border lg:col-span-2 lg:row-span-1">
        <header className="flex items-start justify-between mb-3">
          <h2 className="text-base text-foreground font-semibold">Variables del Usuario</h2>
          <User className="h-4 w-4 text-primary" />
        </header>

        <dl className="space-y-0">
          <div className="flex justify-between text-xs py-1.5">
            <dt className="text-muted-foreground">Edad</dt>
            <dd className="text-foreground font-medium">{userData.profile.edad} años</dd>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-t border-border">
            <dt className="text-muted-foreground">Género</dt>
            <dd className="text-foreground font-medium">{userData.profile.genero}</dd>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-t border-border">
            <dt className="text-muted-foreground">Peso</dt>
            <dd className="text-foreground font-medium">{userData.profile.peso} kg</dd>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-t border-border">
            <dt className="text-muted-foreground">Altura</dt>
            <dd className="text-foreground font-medium">{userData.profile.altura} cm</dd>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-t border-border">
            <dt className="text-muted-foreground">Pulsaciones Reposo</dt>
            <dd className="text-foreground font-medium">{userData.profile.pulsacionesReposo} bpm</dd>
          </div>
          <div className="flex justify-between text-xs py-1.5 border-t border-border">
            <dt className="text-muted-foreground">Duración Sesiones</dt>
            <dd className="text-foreground font-medium">{userData.profile.duracionSesiones} min</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4 bg-card border-border lg:col-span-6 lg:row-span-2">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Lista de Ejercicios</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Filtrar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EXERCISE_TYPES.PUSH}>{EXERCISE_TYPES.PUSH}</SelectItem>
                <SelectItem value={EXERCISE_TYPES.PULL}>{EXERCISE_TYPES.PULL}</SelectItem>
                <SelectItem value={EXERCISE_TYPES.LEGS}>{EXERCISE_TYPES.LEGS}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

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

        <ul className="space-y-0">
          {filteredExercises.map((exercise, index) => (
            <li
              key={exercise.id}
              onClick={() => toggleExercise(exercise.id)}
              className={`flex items-center gap-3 p-2 cursor-pointer transition-colors ${
                index > 0 ? "border-t border-border" : ""
              } ${
                selectedExercises.includes(exercise.id) ? "bg-muted/50" : "hover:bg-muted/50"
              }`}
            >
              <p className="flex-1 min-w-0 text-xs font-medium text-foreground truncate">{exercise.name}</p>
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className={`w-32 text-center text-sm font-bold ${getScoreColor(exercise.affinityIndex)}`}>
                  {exercise.affinityIndex.toFixed(1)}
                </p>
                <p className={`w-32 text-center text-sm font-bold ${getScoreColor(exercise.biomechanicalEfficiency)}`}>
                  {exercise.biomechanicalEfficiency.toFixed(1)}
                </p>
                <Checkbox checked={selectedExercises.includes(exercise.id)} className="pointer-events-none" />
              </div>
            </li>
          ))}
        </ul>

        {selectedExercises.length === MAX_SELECTED_EXERCISES && (
          <p className="text-xs text-warning mt-2">Máximo {MAX_SELECTED_EXERCISES} ejercicios seleccionados</p>
        )}
      </Card>

      {/* Observaciones - Row 2, Col 1-2 */}
      <Card className="p-4 bg-card border-border lg:col-span-4 lg:row-span-1">
        <header className="flex items-start justify-between mb-3">
          <h2 className="text-base text-foreground font-semibold">Observaciones del Usuario</h2>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </header>

        <article className="bg-muted/50 rounded-lg p-3 h-full">
          <p className="text-xs text-foreground leading-relaxed">
            {userData.observations}
          </p>
        </article>
      </Card>

      
    </section>
  )
}
