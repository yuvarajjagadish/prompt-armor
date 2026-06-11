import { analyzePrompt } from './analyzer';

export interface ScanRequest {
  prompt: string;
  context?: string;
}

export interface ScanResult {
  isSafe: boolean;
  score: number; // 0 to 1 risk score
  detectedVulnerabilities: string[];
}

export async function scanPrompt(request: ScanRequest): Promise<ScanResult> {
  const analysis = analyzePrompt(request.prompt);
  return {
    isSafe: analysis.riskScore < 0.45,
    score: analysis.riskScore,
    detectedVulnerabilities: analysis.findings.map(f => f.matchedPatternName),
  };
}

export * from './analyzer';
