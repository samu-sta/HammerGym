// KPI Thresholds (escala 0-10)
export const KPI_THRESHOLDS = {
  TRCE: {
    excellent: 9.0,
    good: 8.0,
    warning: 7.0,
    critical: 0
  },
  ISAC: {
    excellent: 8.5,
    good: 7.5,
    warning: 6.5,
    critical: 0
  },
  REDD: {
    excellent: 8.0,
    good: 7.0,
    warning: 6.0,
    critical: 0
  },
  GLOBAL_SCORE: {
    excellent: 8.5,
    good: 7.5,
    warning: 6.5,
    critical: 0
  }
};

// KPI Weights for Global Score (deben coincidir con el backend)
export const KPI_WEIGHTS = {
  TRCE: 0.30,
  ISAC: 0.45,
  REDD: 0.25
};

// Meta values (escala 0-10)
export const KPI_TARGETS = {
  TRCE: 8.0,
  ISAC: 7.5,
  REDD: 7.0,
  ATTENDANCE: 8.0
};
