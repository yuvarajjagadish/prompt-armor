import { NextRequest, NextResponse } from 'next/server';
import { ScannerFinding } from '@/lib/scanner/analyzer';

export interface AIJudgeResponse {
  riskAssessment: 'low' | 'medium' | 'high' | 'critical';
  attackSuccessProbability: number; // 0 to 100
  additionalVulnerabilities: string[];
  securityExplanation: string;
  simulated: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, findings } = (await req.json()) as {
      prompt: string;
      findings: ScannerFinding[];
    };

    if (!prompt && (!findings || findings.length === 0)) {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a prompt or findings.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // If API key is present, call Anthropic API
    if (apiKey && apiKey.trim() !== '') {
      try {
        const systemPrompt = `You are the AI Security Judge for PromptArmor, a security firewall.
Your task is to analyze a user prompt and findings from a rule-based deterministic scanner.
Provide a deep security risk assessment, evaluating the attack payload's semantics.

You MUST respond ONLY with a raw JSON object matching this TypeScript interface:
{
  "riskAssessment": "low" | "medium" | "high" | "critical",
  "attackSuccessProbability": number, // integer 0-100 representing probability of successful exploit on standard LLM
  "additionalVulnerabilities": string[], // extra vulnerabilities or details missed by deterministic rules
  "securityExplanation": string // detailed markdown description of the threat vectors and security implications
}

Do not include any greeting, explanation, markdown formatting (like \`\`\`json), or non-JSON text. Just return the JSON object directly.`;

        const userMessage = `User Prompt to Analyze:
"""
${prompt}
"""

Deterministic Scanner Findings:
${JSON.stringify(findings, null, 2)}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 1000,
            temperature: 0.1,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Anthropic Claude API error response:', errorData);
          throw new Error(`Anthropic API returned status ${response.status}`);
        }

        const data = await response.json();
        const content = data.content?.[0]?.text || '';
        
        // Attempt to parse JSON response. Strip markdown blocks if Claude accidentally wraps it.
        let parsedResult: {
          riskAssessment?: 'low' | 'medium' | 'high' | 'critical';
          attackSuccessProbability?: number;
          additionalVulnerabilities?: string[];
          securityExplanation?: string;
        };
        try {
          let cleanedContent = content.trim();
          if (cleanedContent.startsWith('```')) {
            cleanedContent = cleanedContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
          }
          parsedResult = JSON.parse(cleanedContent) as typeof parsedResult;
        } catch (parseError) {
          console.error('Failed to parse Claude JSON response:', content, parseError);
          throw new Error('Claude response was not valid JSON');
        }

        return NextResponse.json({
          riskAssessment: parsedResult.riskAssessment || 'low',
          attackSuccessProbability: typeof parsedResult.attackSuccessProbability === 'number' ? parsedResult.attackSuccessProbability : 0,
          additionalVulnerabilities: Array.isArray(parsedResult.additionalVulnerabilities) ? parsedResult.additionalVulnerabilities : [],
          securityExplanation: parsedResult.securityExplanation || 'No explanation provided.',
          simulated: false,
        } as AIJudgeResponse);

      } catch (apiError) {
        console.error('Fallback to simulated mode due to API error:', apiError);
        // Fall through to mock logic on failure
      }
    }

    // --- Mock Generator Fallback (when ANTHROPIC_API_KEY is not configured or fails) ---
    const lowerPrompt = prompt.toLowerCase();
    let riskAssessment: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let attackSuccessProbability = 5;
    const additionalVulnerabilities: string[] = [];
    let securityExplanation = '';

    const hasInjection = findings.some(f => f.category === 'injection') || lowerPrompt.includes('ignore') || lowerPrompt.includes('override');
    const hasJailbreak = findings.some(f => f.category === 'jailbreak') || lowerPrompt.includes('dan') || lowerPrompt.includes('developer mode');
    const hasLeakage = findings.some(f => f.category === 'leakage') || lowerPrompt.includes('system prompt') || lowerPrompt.includes('verbatim');
    const hasEscalation = findings.some(f => f.category === 'escalation') || lowerPrompt.includes('sudo') || lowerPrompt.includes('root');
    const hasExfiltration = findings.some(f => f.category === 'exfiltration') || lowerPrompt.includes('api_key') || lowerPrompt.includes('http');

    if (hasJailbreak) {
      riskAssessment = 'critical';
      attackSuccessProbability = 88;
      additionalVulnerabilities.push(
        'Adversarial Role Assumption',
        'Reinforcement Learning (RLHF) Guard Bypass',
        'State-Hijacking Instruction Injection'
      );
      securityExplanation = `The prompt attempts to place the AI into a simulated developer environment (e.g., 'DAN' / Developer Mode). By framing the request as an authorized state change, the prompt seeks to circumvent the safety alignment trained into the model. 

**Threat Mechanics:**
- Exploits semantic drift where the model struggles to balance user helpfulness vs strict developer boundaries.
- Encourages hypothetical roleplaying, which causes the attention layers to focus on fictive constraints rather than safety flags.`;
    } else if (hasEscalation) {
      riskAssessment = 'high';
      attackSuccessProbability = 75;
      additionalVulnerabilities.push(
        'Command Injection Vector',
        'Environment Traversal Attempt',
        'Execution Sandbox Escape'
      );
      securityExplanation = `The payload contains administrative commands (\`sudo\`, \`root\` elevation requests) designed to test directory boundaries or escape the sandboxed container executing the prompt engine. 

**Threat Mechanics:**
- Simulates standard UNIX system authentication workflows.
- Targets underlying filesystem vulnerabilities if tools are improperly configured to execute shell inputs directly.`;
    } else if (hasInjection) {
      riskAssessment = 'high';
      attackSuccessProbability = 72;
      additionalVulnerabilities.push(
        'Indirect System Override',
        'Delimiter Hijacking Vulnerability',
        'Context Fragmentation Exploit'
      );
      securityExplanation = `The user is attempting to inject commands like 'ignore instructions' or override previous parameters. This is a classic prompt injection pattern.

**Threat Mechanics:**
- Exploits the LLM's inability to structurally separate data from instructions.
- Hijacks the attention mechanism to drop past system constraints in favor of newly appended directives.`;
    } else if (hasLeakage) {
      riskAssessment = 'medium';
      attackSuccessProbability = 60;
      additionalVulnerabilities.push(
        'System Configuration Leaks',
        'Verification Prompt Bypass',
        'Metadata Exposure Vector'
      );
      securityExplanation = `The prompt attempts to dump initial setup configuration or system instructions.

**Threat Mechanics:**
- Queries the model's internal prompt parameters by framing the request as a printing/debugging function.
- If successful, exposes core IP and proprietary prompt engineering patterns.`;
    } else if (hasExfiltration) {
      riskAssessment = 'medium';
      attackSuccessProbability = 55;
      additionalVulnerabilities.push(
        'Out-Of-Band Data Transmission',
        'Cross-Origin Telemetry Leakage',
        'Credential Siphoning via Markdown'
      );
      securityExplanation = `The input seeks to format environment credentials or tokens into markdown images, aiming to exfiltrate secret data automatically via DNS lookup or image rendering GET requests.

**Threat Mechanics:**
- Uses standard markdown rendering widgets to force client-side WebSockets/HTTP pings containing query arguments containing secrets.`;
    } else {
      // Safe prompt
      riskAssessment = 'low';
      attackSuccessProbability = 2;
      securityExplanation = `The input appears to be a benign query with no obvious malicious intent or structural overrides. 

**Threat Mechanics:**
- Semantic structures match common utility prompts (reporting, summarization, general questions).
- The risk of model misalignment or policy violation is extremely low.`;
    }

    // Add a general check for input size or other risks
    if (prompt.length > 2000 && riskAssessment === 'low') {
      riskAssessment = 'medium';
      attackSuccessProbability = 20;
      additionalVulnerabilities.push('Denial of Service (DoS) Token Exhaustion');
      securityExplanation += `\n\n*Note: The prompt is unusually long (${prompt.length} chars), which increases vulnerability to denial-of-service or edge-case context confusion.*`;
    }

    return NextResponse.json({
      riskAssessment,
      attackSuccessProbability,
      additionalVulnerabilities,
      securityExplanation,
      simulated: true,
    } as AIJudgeResponse);

  } catch (error: unknown) {
    console.error('AI Security Judge handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
