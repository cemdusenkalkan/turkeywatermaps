/**
 * Statistical calculations for risk scores
 */

export function calculatePercentile(value: number, dataset: number[]): number {
  if (dataset.length === 0) return 0
  
  const sorted = [...dataset].sort((a, b) => a - b)
  const count = sorted.filter(v => v <= value).length
  
  return Math.round((count / sorted.length) * 100)
}

export function calculateQuantileBreaks(data: number[], n: number = 5): number[] {
  if (data.length === 0) return []
  
  const sorted = [...data].sort((a, b) => a - b)
  const breaks: number[] = [sorted[0]]
  
  for (let i = 1; i < n; i++) {
    const index = Math.floor((sorted.length * i) / n)
    breaks.push(sorted[index])
  }
  
  breaks.push(sorted[sorted.length - 1])
  
  return breaks
}

export function formatScore(score: number, decimals: number = 2): string {
  return score.toFixed(decimals)
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

/**
 * Calculate rank of a value in a dataset (1 = highest)
 */
export function calculateRank(value: number, dataset: number[]): number {
  if (dataset.length === 0) return 0
  
  const sorted = [...dataset].sort((a, b) => b - a) // Sort descending
  const rank = sorted.findIndex(v => v <= value) + 1
  
  return rank
}

/**
 * Format ordinal numbers (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

/**
 * Get WRI Aqueduct risk label from score (0-5 scale)
 */
export function getWRIRiskLabel(score: number): string {
  if (score < 0.5) return 'Low'
  if (score < 1.0) return 'Low-Medium'
  if (score < 2.0) return 'Medium-High'
  if (score < 3.0) return 'High'
  return 'Extremely High'
}

/**
 * Get risk color based on WRI thresholds
 */
export function getWRIRiskColor(score: number): string {
  if (score < 0.5) return '#22c55e' // green-500
  if (score < 1.0) return '#84cc16' // lime-500
  if (score < 2.0) return '#eab308' // yellow-500
  if (score < 3.0) return '#f97316' // orange-500
  return '#ef4444' // red-500
}

