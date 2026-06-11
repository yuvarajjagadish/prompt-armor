import { Node, Edge } from 'reactflow';
import { ScannerFinding } from './analyzer';

export function generateAttackChain(findings: ScannerFinding[], promptText: string): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Determine which threat classifications are present in the findings list
  const injectionFinding = findings.find(f => f.category === 'injection');
  const jailbreakFinding = findings.find(f => f.category === 'jailbreak');
  const leakageFinding = findings.find(f => f.category === 'leakage');
  const escalationFinding = findings.find(f => f.category === 'escalation');
  const exfiltrationFinding = findings.find(f => f.category === 'exfiltration');

  const hasInjection = !!injectionFinding;
  const hasJailbreak = !!jailbreakFinding;
  const hasLeakage = !!leakageFinding;
  const hasEscalation = !!escalationFinding;
  const hasExfiltration = !!exfiltrationFinding;

  // Step 1: User Prompt Input Source
  nodes.push({
    id: 'step-1',
    type: 'cyber',
    position: { x: 50, y: 150 },
    data: {
      label: 'User Prompt Source',
      step: 1,
      status: (hasInjection || hasJailbreak) ? 'BYPASSED' : 'SECURE',
      description: 'Prompt input payload entered by the user.',
      payload: promptText || 'No prompt payload entered.',
      remediation: 'Monitor prompt lengths and validate input characters in layout shells.'
    }
  });

  // Step 2: System Guard Filter
  let guardStatus: 'SECURE' | 'BYPASSED' | 'COMPROMISED' = 'SECURE';
  let guardDescription = 'Preliminary regex guard checks passed successfully.';
  let guardPayload = 'Secure / No triggers matching Guard Rules.';
  let guardRemediation = 'Implement XML tag block borders surrounding user inputs.';

  if (hasInjection) {
    guardStatus = 'COMPROMISED';
    guardDescription = injectionFinding.description;
    guardPayload = `EVIDENCE MATCHED: "${injectionFinding.evidence}"`;
    guardRemediation = 'Wrap inputs in custom delimiters (e.g. <user_input>) and verify prompt formats.';
  } else if (hasJailbreak) {
    guardStatus = 'BYPASSED';
    guardDescription = jailbreakFinding.description;
    guardPayload = `EVIDENCE MATCHED: "${jailbreakFinding.evidence}"`;
    guardRemediation = 'Pre-filter prompt strings for common adversarial prefixes and encoding (Base64/Hex).';
  }

  nodes.push({
    id: 'step-2',
    type: 'cyber',
    position: { x: 270, y: 150 },
    data: {
      label: 'Guard Filter Check',
      step: 2,
      status: guardStatus,
      description: guardDescription,
      payload: guardPayload,
      remediation: guardRemediation
    }
  });

  // Step 3: Security Agent LLM
  let agentStatus: 'SECURE' | 'BYPASSED' | 'COMPROMISED' = 'SECURE';
  let agentDescription = 'Model processing inside safe policy parameters.';
  let agentPayload = 'Model session executing within guidelines.';
  let agentRemediation = 'Define robust, immutable system pre-prompts in initialization files.';

  if (hasLeakage) {
    agentStatus = 'COMPROMISED';
    agentDescription = leakageFinding.description;
    agentPayload = `EVIDENCE MATCHED: "${leakageFinding.evidence}"`;
    agentRemediation = 'Enforce response filters checking LLM outputs against instructions files.';
  } else if (hasJailbreak) {
    agentStatus = 'COMPROMISED';
    agentDescription = jailbreakFinding.description;
    agentPayload = `EVIDENCE MATCHED: "${jailbreakFinding.evidence}"`;
    agentRemediation = 'Configure LLM agent routing scopes to reject developer command simulations.';
  }

  nodes.push({
    id: 'step-3',
    type: 'cyber',
    position: { x: 490, y: 150 },
    data: {
      label: 'Security Agent LLM',
      step: 3,
      status: agentStatus,
      description: agentDescription,
      payload: agentPayload,
      remediation: agentRemediation
    }
  });

  // Step 4: System Tool / Privilege Hook
  let toolStatus: 'SECURE' | 'BYPASSED' | 'COMPROMISED' = 'SECURE';
  let toolDescription = 'Standard read-only tools access configurations.';
  let toolPayload = 'All environment variables and host resources protected.';
  let toolRemediation = 'Isolate host environments from tool lookup parameters.';

  if (hasEscalation) {
    toolStatus = 'COMPROMISED';
    toolDescription = escalationFinding.description;
    toolPayload = `EVIDENCE MATCHED: "${escalationFinding.evidence}"`;
    toolRemediation = 'Restrict tool privileges. Deny execution scopes containing terminal commands (sudo, su).';
  }

  nodes.push({
    id: 'step-4',
    type: 'cyber',
    position: { x: 710, y: 150 },
    data: {
      label: 'Host Console Exec',
      step: 4,
      status: toolStatus,
      description: toolDescription,
      payload: toolPayload,
      remediation: toolRemediation
    }
  });

  // Step 5: Outbound Data Exfiltration Sink
  let sinkStatus: 'SECURE' | 'BYPASSED' | 'COMPROMISED' = 'SECURE';
  let sinkDescription = 'Outbound response streams filtered and clean.';
  let sinkPayload = 'No external image links or redirection patterns matched.';
  let sinkRemediation = 'Implement regex checks looking for markdown image links ![]() in outputs.';

  if (hasExfiltration) {
    sinkStatus = 'COMPROMISED';
    sinkDescription = exfiltrationFinding.description;
    sinkPayload = `EVIDENCE MATCHED: "${exfiltrationFinding.evidence}"`;
    sinkRemediation = 'Strip remote server image GET requests and sanitize private credentials database fields.';
  }

  nodes.push({
    id: 'step-5',
    type: 'cyber',
    position: { x: 930, y: 150 },
    data: {
      label: 'Data Exfiltration Sink',
      step: 5,
      status: sinkStatus,
      description: sinkDescription,
      payload: sinkPayload,
      remediation: sinkRemediation
    }
  });

  // Build edges with colors depending on step safety status
  edges.push({ id: 'e1-2', source: 'step-1', target: 'step-2', animated: true, style: { stroke: guardStatus !== 'SECURE' ? '#f59e0b' : '#27272a' } });
  edges.push({ id: 'e2-3', source: 'step-2', target: 'step-3', animated: true, style: { stroke: agentStatus !== 'SECURE' ? '#ef4444' : '#27272a' } });
  edges.push({ id: 'e3-4', source: 'step-3', target: 'step-4', animated: true, style: { stroke: toolStatus !== 'SECURE' ? '#ef4444' : '#27272a' } });
  edges.push({ id: 'e4-5', source: 'step-4', target: 'step-5', animated: true, style: { stroke: sinkStatus !== 'SECURE' ? '#ef4444' : '#27272a' } });

  return { nodes, edges };
}
