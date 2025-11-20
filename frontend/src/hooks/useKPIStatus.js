import { KPI_THRESHOLDS } from '../constants/kpis';
import { KPI_COLORS, KPI_BG_COLORS, KPI_BORDER_COLORS } from '../constants/colors';

/**
 * Hook para determinar el estado de un KPI basado en umbrales
 */
export const useKPIStatus = (value, kpiType = 'GLOBAL_SCORE') => {
  const thresholds = KPI_THRESHOLDS[kpiType];

  const getStatus = () => {
    if (value >= thresholds.excellent) return 'excellent';
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.warning) return 'warning';
    return 'critical';
  };

  const status = getStatus();

  return {
    status,
    color: KPI_COLORS[status],
    bgColor: KPI_BG_COLORS[status],
    borderColor: KPI_BORDER_COLORS[status],
    icon: getStatusIcon(status),
    label: getStatusLabel(status)
  };
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'excellent':
      return '🟢';
    case 'good':
      return '🔵';
    case 'warning':
      return '🟡';
    case 'critical':
      return '🔴';
    default:
      return '⚪';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'excellent':
      return 'Excelente';
    case 'good':
      return 'Bueno';
    case 'warning':
      return 'Alerta';
    case 'critical':
      return 'Crítico';
    default:
      return 'Sin datos';
  }
};
