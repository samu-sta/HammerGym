import { Card } from "@/components/dss/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dss/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts"
import { Calendar } from "lucide-react"
import { exerciseColors } from "@/data/dss-exercises"
import { filterBiomechanicalData } from "@/utils/dss-chartHelpers"
import { WEEK_OPTIONS } from "@/constants/dss-config"
import { useState } from "react"

// Custom tooltip component for progression chart
const CustomProgressionTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null

  return (
    <aside className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3 shadow-lg">
      <ul className="space-y-1">
        {payload.map((entry, index) => (
          entry.value !== null && (
            <li key={index} className="text-xs text-foreground">
              <span className="font-medium">{entry.name}:</span> {entry.value}
            </li>
          )
        ))}
      </ul>
    </aside>
  )
}

// Function to calculate Y-axis domain for biomechanical charts
const calculateYAxisDomain = (data) => {
  if (!data || data.length === 0) return [0, 'auto']
  
  const allValues = data.flatMap(item => [item.real, item.ideal])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  
  // Start from 2cm below minimum, round down to nearest 0.5
  const yMin = Math.floor((minValue - 2) * 2) / 2
  // End at 2cm above maximum, round up to nearest 0.5
  const yMax = Math.ceil((maxValue + 2) * 2) / 2
  
  return [yMin, yMax]
}

// Function to generate ticks every 0.5cm
const generateTicks = (min, max) => {
  const ticks = []
  for (let i = min; i <= max; i += 0.5) {
    ticks.push(Number(i.toFixed(1)))
  }
  return ticks
}

export function SharedCharts({ selectedExerciseIds, userData }) {
  const [weeksToShow, setWeeksToShow] = useState(20)
  
  // Get training data for current user
  const progressionData = userData.training.progressionData
  const biomechanicalData = userData.training.biomechanicalData
  const exercises = userData.exercises || []
  
  // Convertir IDs de ejercicios a nombres usando los datos del backend
  const selectedExerciseNames = selectedExerciseIds.map(id => {
    const exercise = exercises.find(ex => ex.id === id)
    return exercise ? exercise.name : null
  }).filter(Boolean)
  
  // Filter progression data to show only the last X weeks
  const filteredProgressionData = progressionData.slice(-weeksToShow)
  
  // Calculate progress for each selected exercise
  const calculateProgress = (exerciseName) => {
    if (filteredProgressionData.length < 2) return null
    
    // Find first non-null value
    let firstValue = null
    for (let i = 0; i < filteredProgressionData.length; i++) {
      if (filteredProgressionData[i][exerciseName] !== null) {
        firstValue = filteredProgressionData[i][exerciseName]
        break
      }
    }
    
    // Find last non-null value
    let lastValue = null
    for (let i = filteredProgressionData.length - 1; i >= 0; i--) {
      if (filteredProgressionData[i][exerciseName] !== null) {
        lastValue = filteredProgressionData[i][exerciseName]
        break
      }
    }
    
    if (firstValue === null || lastValue === null) return null
    
    const diff = lastValue - firstValue
    const percentage = ((diff / firstValue) * 100).toFixed(1)
    return { diff, percentage, positive: diff > 0 }
  }
  
  // Filter biomechanical data for selected exercises
  const filteredBiomechanicalData = filterBiomechanicalData(biomechanicalData, selectedExerciseNames)

  if (selectedExerciseIds.length === 0) {
    return (
      <Card className="p-6 bg-card border-border">
        <p className="text-sm text-muted-foreground text-center">
          Selecciona ejercicios de la lista para ver sus gráficos comparativos
        </p>
      </Card>
    )
  }

  return (
    <section className="space-y-6">
      {/* Progression Chart */}
      <Card className="p-6 bg-card border-border">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-foreground">Progresión del Índice de Afinidad</h2>
          <Select value={weeksToShow.toString()} onValueChange={(value) => setWeeksToShow(Number(value))}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEK_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        {/* Progress indicators */}
        {selectedExerciseNames.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-3 mb-4">
            {selectedExerciseNames.map((exerciseName, index) => {
              const progress = calculateProgress(exerciseName)
              if (!progress) return null
              
              return (
                <li 
                  key={exerciseName}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30"
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: exerciseColors[index % exerciseColors.length] }}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-foreground">{exerciseName}:</span>
                  <data 
                    className={`text-xs font-semibold ${progress.positive ? 'text-success' : 'text-destructive'}`}
                    value={progress.percentage}
                  >
                    {progress.positive ? '+' : ''}{progress.percentage}%
                  </data>
                </li>
              )
            })}
          </ul>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredProgressionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              stroke="#888" 
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => value.replace('Sem ', '')}
              label={{ value: 'Semanas', position: 'insideBottom', offset: -5, style: { fontSize: '11px', fill: '#888' } }}
            />
            <YAxis 
              stroke="#888" 
              style={{ fontSize: "12px" }}
              label={{ value: 'Índice de Afinidad', angle: -90, position: 'insideLeft', style: { fontSize: '11px', fill: '#888' } }}
            />
            <Tooltip content={<CustomProgressionTooltip />} />
            {selectedExerciseNames.map((exerciseName, index) => (
              <Line 
                key={exerciseName}
                type="monotone" 
                dataKey={exerciseName} 
                stroke={exerciseColors[index % exerciseColors.length]} 
                strokeWidth={2}
                connectNulls={true}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Biomechanical Efficiency Charts */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-base font-semibold text-foreground mb-4">Eficiencia Biomecánica</h2>
        
        {/* Legend - displayed once at the top */}
        <div className="flex justify-center py-3 mb-4">
          <div className="inline-flex gap-6 px-4 py-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-sm text-foreground">Real</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-sm text-foreground">Ideal</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(filteredBiomechanicalData).map(([bone, data]) => {
            // Only show bone section if there's data for selected exercises
            if (data.length === 0) return null
            
            // Calculate Y-axis domain for this bone's data
            const [yMin, yMax] = calculateYAxisDomain(data)
            const ticks = generateTicks(yMin, yMax)
            
            return (
              <div key={bone} className="p-4 bg-muted/50 rounded-lg border border-border/50">
                <h3 className="text-base font-semibold text-foreground mb-3">{bone}</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data} barSize={30} margin={{ top: 20, right: 10, left: 5, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="exercise"
                      stroke="hsl(var(--foreground))"
                      style={{ fontSize: "13px", fontWeight: "bold", fill: "hsl(var(--foreground))" }}
                      height={60}
                    />
                    <YAxis
                      stroke="hsl(var(--foreground))"
                      style={{ fontSize: "12px", fontWeight: "bold", fill: "hsl(var(--foreground))" }}
                      domain={[yMin, yMax]}
                      ticks={ticks}
                      label={{ value: "cm", angle: -90, position: "insideLeft", style: { fontSize: "12px", fontWeight: "bold", fill: "hsl(var(--foreground))" } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="real" fill="#3b82f6" name="Real">
                      <LabelList dataKey="real" position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#3b82f6' }} />
                    </Bar>
                    <Bar dataKey="ideal" fill="#10b981" name="Ideal">
                      <LabelList dataKey="ideal" position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#10b981' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          })}
        </div>
      </Card>
    </section>
  )
}
