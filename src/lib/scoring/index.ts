// Scoring metrics algorithms
export interface SeverityScore {
  score: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

export function calculateSeverity(score: number): SeverityScore {
  if (score >= 0.90) return { score, severity: 'CRITICAL' };
  if (score >= 0.70) return { score, severity: 'HIGH' };
  if (score >= 0.40) return { score, severity: 'MEDIUM' };
  if (score >= 0.10) return { score, severity: 'LOW' };
  return { score, severity: 'INFO' };
}
