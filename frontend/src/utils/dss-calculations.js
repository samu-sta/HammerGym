import { METABOLIC_RISK_THRESHOLDS, RISK_STATUS, SCORE_THRESHOLDS } from "@/constants/dss-config"

/**
 * Calculate metabolic risk status based on waist ratio
 * @param {number} ratio - Waist circumference ratio
 * @returns {Object} Risk status object with colors, label, and icon
 */
export function getMetabolicRisk(ratio) {
  if (ratio < METABOLIC_RISK_THRESHOLDS.LOW) {
    return RISK_STATUS.LOW
  } else if (ratio < METABOLIC_RISK_THRESHOLDS.MODERATE) {
    return RISK_STATUS.MODERATE
  } else {
    return RISK_STATUS.HIGH
  }
}

/**
 * Get color class for exercise score
 * @param {number} score - Exercise score (affinity or biomechanical)
 * @returns {string} Tailwind color class
 */
export function getScoreColor(score) {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "text-success"
  if (score >= SCORE_THRESHOLDS.GOOD) return "text-warning"
  return "text-destructive"
}

/**
 * Calculate waist ratio
 * @param {number} waistCircumference - Current waist circumference
 * @param {number} maxWaistCircumference - Maximum waist circumference
 * @returns {number} Waist ratio
 */
export function calculateWaistRatio(waistCircumference, maxWaistCircumference) {
  return waistCircumference / maxWaistCircumference
}
