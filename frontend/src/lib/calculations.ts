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

