// Application configuration constants

// Exercise selection limits
export const MAX_SELECTED_EXERCISES = 5

// Metabolic risk thresholds
export const METABOLIC_RISK_THRESHOLDS = {
  LOW: 0.8,
  MODERATE: 0.9,
}

// Risk status definitions
export const RISK_STATUS = {
  LOW: {
    textColor: "text-success",
    bgColor: "bg-success/20",
    label: "Bajo Riesgo",
    icon: "✓",
  },
  MODERATE: {
    textColor: "text-warning",
    bgColor: "bg-warning/20",
    label: "Riesgo Moderado",
    icon: "!",
  },
  HIGH: {
    textColor: "text-destructive",
    bgColor: "bg-destructive/20",
    label: "Alto Riesgo",
    icon: "⚠",
  },
}

// Score color thresholds for exercises
export const SCORE_THRESHOLDS = {
  EXCELLENT: 8,
  GOOD: 6.5,
}

// Exercise types
export const EXERCISE_TYPES = {
  PUSH: "Empuje",
  PULL: "Jalón",
  LEGS: "Pierna",
}

// Week options for chart filtering
export const WEEK_OPTIONS = [
  { value: 4, label: "Últimas 4 semanas" },
  { value: 6, label: "Últimas 6 semanas" },
  { value: 8, label: "Últimas 8 semanas" },
  { value: 10, label: "Últimas 10 semanas" },
  { value: 12, label: "Últimas 12 semanas" },
  { value: 16, label: "Últimas 16 semanas" },
  { value: 20, label: "Últimas 20 semanas" },
]
