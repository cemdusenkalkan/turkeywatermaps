/**
 * Color scales for water risk visualization
 * All palettes are color-blind safe
 */

export const RISK_COLORS = {
  // Viridis-inspired for combined index
  viridis: [
    '#fde724', // 0-1: Very Low
    '#90d743', // 1-2: Low
    '#35b779', // 2-3: Medium
    '#31688e', // 3-4: High
    '#440154', // 4-5: Very High
  ],
  
  // Red-Yellow-Blue diverging for stress
  stress: [
    '#2166ac', // 0-1: Low stress
    '#67a9cf', // 1-2: Medium-Low
    '#f7f7f7', // 2-3: Medium
    '#fddbc7', // 3-4: Medium-High
    '#d73027', // 4-5: High stress
  ],
  
  // Sequential for drought/flood
  sequential_blue: [
    '#eff3ff',
    '#bdd7e7',
    '#6baed6',
    '#3182bd',
    '#08519c',
  ],
  
  sequential_red: [
    '#fee5d9',
    '#fcae91',
    '#fb6a4a',
    '#de2d26',
    '#a50f15',
  ],
}

export function getColorScale(categoryId: string): string[] {
  const colorMap: Record<string, string[]> = {
    combined_risk: RISK_COLORS.viridis,
    baseline_stress: RISK_COLORS.stress,
    seasonal_variability: RISK_COLORS.sequential_blue,
    drought_hazard: RISK_COLORS.sequential_red,
    flood_hazard: RISK_COLORS.sequential_blue,
    groundwater_stress: RISK_COLORS.stress,
    interannual_variability: RISK_COLORS.sequential_blue,
    demand_pressure: RISK_COLORS.sequential_red,
  }
  
  return colorMap[categoryId] || RISK_COLORS.viridis
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

