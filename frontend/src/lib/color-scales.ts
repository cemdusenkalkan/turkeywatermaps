/**
 * Color scales for water risk visualization
 * Blue tones for all categories
 */

export const RISK_COLORS = {
  // Light blue to dark blue scale for all categories
  blueShades: [
    '#dbeafe', // 0-1: Very Low (very light blue)
    '#93c5fd', // 1-2: Low (light blue)
    '#3b82f6', // 2-3: Medium (medium blue)
    '#1d4ed8', // 3-4: High (dark blue)
    '#1e3a8a', // 4-5: Very High (very dark blue)
  ],
}

export function getColorScale(): string[] {
  // All categories use the same blue scale
  return RISK_COLORS.blueShades
}

export function getColorForScore(score: number, colors: string[]): string {
  // Map score (0-5) to color array index
  const index = Math.min(Math.floor(score), colors.length - 1)
  return colors[index]
}

export function getRiskLabel(score: number): string {
  if (score < 1) return 'Very Low'
  if (score < 2) return 'Low'
  if (score < 3) return 'Medium'
  if (score < 4) return 'High'
  return 'Very High'
}

