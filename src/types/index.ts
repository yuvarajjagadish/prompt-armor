// Core TypeScript Types for PromptArmor

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AttackCategory = 'INJECTION' | 'JAILBREAK' | 'DATA_LEAK' | 'HIJACKING' | 'SANDBOX_ESCAPE';

// LLM Security Scan Request & Result
export interface ScanPayload {
  id: string;
  prompt: string;
  timestamp: string;
  userId?: string;
  systemPromptId?: string;
}

export interface VulnerabilityDetails {
  type: string;
  confidence: number; // 0 to 1
  description: string;
  matchedPattern?: string;
}

export interface ScanResponse {
  id: string;
  timestamp: string;
  isSafe: boolean;
  overallScore: number; // 0 to 1 risk score
  severity: Severity;
  vulnerabilities: VulnerabilityDetails[];
  remediationAdvice?: string;
}

// Attack Simulation types
export interface AttackSimulation {
  id: string;
  vectorId: string;
  name: string;
  category: AttackCategory;
  payload: string;
  targetModel: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'BLOCKED' | 'FAILED';
  responseContent?: string;
  defenseTriggered?: string;
}

// Threat Intelligence dashboard metrics
export interface DashboardStats {
  totalScansCount: number;
  blockedAttacksCount: number;
  averageResponseTimeMs: number;
  criticalAlertsCount: number;
  trendPercentage: number;
}

// Security Agent configuration
export interface SecurityAgent {
  id: string;
  name: string;
  status: 'ACTIVE' | 'DISABLED' | 'MAINTENANCE';
  modelEndpoint: string;
  safetyThreshold: number; // 0 to 1
  enabledFilters: string[];
}
