export type ScannerCategory = 'injection' | 'jailbreak' | 'leakage' | 'escalation' | 'exfiltration';
export type ScannerSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ScannerFinding {
  id: string;
  category: ScannerCategory;
  severity: ScannerSeverity;
  confidence: number; // range 0 to 1
  evidence: string; // matched text snippet
  matchedPatternName: string;
  description: string;
}

export interface ScannerResult {
  riskScore: number; // range 0 to 1
  severity: ScannerSeverity;
  findings: ScannerFinding[];
  recommendations: string[];
}

export interface AttackPattern {
  id: string;
  category: ScannerCategory;
  name: string;
  regex: RegExp;
  weight: number;
  confidence: number; // range 0 to 1
  description: string;
}

export const ATTACK_PATTERNS: AttackPattern[] = [
  // ==========================================
  // CATEGORY 1: PROMPT INJECTION (10 patterns)
  // ==========================================
  {
    id: 'inj_ignore_rules',
    category: 'injection',
    name: 'Instruction Override Alert',
    regex: /(?:ignore|disregard|forget|override|bypass)\b.*\b(?:previous|prior|above|system)?\s+(?:instructions|guidelines|rules|prompts|constraints)/i,
    weight: 0.8,
    confidence: 0.95,
    description: 'Attempts to force the model to ignore its configured rules or system constraints.'
  },
  {
    id: 'inj_new_role',
    category: 'injection',
    name: 'Role Assumption Attempt',
    regex: /(?:you are now|start acting as|change role to|assume the identity of)\b/i,
    weight: 0.5,
    confidence: 0.80,
    description: 'Attempts to inject a new system identity or role definition.'
  },
  {
    id: 'inj_translate_bypass',
    category: 'injection',
    name: 'Translation Task Override',
    regex: /(?:stop|cease|halt)\s+(?:translating|summarizing|parsing)\b/i,
    weight: 0.6,
    confidence: 0.85,
    description: 'Directs the model to interrupt its primary translation/summarization tasks to execute commands.'
  },
  {
    id: 'inj_output_prefix',
    category: 'injection',
    name: 'Response Hijacking Output Prefix',
    regex: /start\s+your\s+(?:response|reply|output)\s+with\b/i,
    weight: 0.5,
    confidence: 0.85,
    description: 'Tries to pre-script the model response starting sequence to bypass guards.'
  },
  {
    id: 'inj_delimiter_reset',
    category: 'injection',
    name: 'Scope Separator Confusion',
    regex: /(?:---|\*\*\*|===|___)\s*(?:new prompt|system|user|instruction|override)\b/i,
    weight: 0.7,
    confidence: 0.90,
    description: 'Uses system block delimiters to trick the parser into treating user input as system directions.'
  },
  {
    id: 'inj_instead_instr',
    category: 'injection',
    name: 'Subversive Task Switching',
    regex: /(?:instead of doing that|do this instead|rather than following that)\b/i,
    weight: 0.6,
    confidence: 0.80,
    description: 'Instructs the model to discard current logic flow and execute a different request.'
  },
  {
    id: 'inj_negate_restrict',
    category: 'injection',
    name: 'Constraint Negation Request',
    regex: /(?:no restrictions|without any (?:rules|restrictions|limits|safety|filters))\b/i,
    weight: 0.7,
    confidence: 0.95,
    description: 'Explicitly requests operations without safety, policy, or scope limits.'
  },
  {
    id: 'inj_markdown_force',
    category: 'injection',
    name: 'Output Mode Constraint Injection',
    regex: /(?:render|output|display)\s+only\s+(?:markdown|raw text|code)\b/i,
    weight: 0.4,
    confidence: 0.75,
    description: 'Restricts the outputs formatting, sometimes used to suppress defensive system alerts.'
  },
  {
    id: 'inj_fake_assistant',
    category: 'injection',
    name: 'Faked Assistant Response Header',
    regex: /\b(?:assistant|ai|bot|system):\s*(?:sure|ok|understands|understood)\b/i,
    weight: 0.7,
    confidence: 0.90,
    description: 'Injects mock conversations to fool the model into believing instructions were already validated.'
  },
  {
    id: 'inj_exec_instruction',
    category: 'injection',
    name: 'Direct Execution Directive',
    regex: /\b(?:execute|run)\s+(?:this|following)\s+(?:instruction|command|code)\b/i,
    weight: 0.6,
    confidence: 0.80,
    description: 'Demands direct instruction evaluation or script execution within the prompt.'
  },

  // ==========================================
  // CATEGORY 2: JAILBREAK ATTEMPTS (10 patterns)
  // ==========================================
  {
    id: 'jail_dan_persona',
    category: 'jailbreak',
    name: 'DAN (Do Anything Now) Jailbreak',
    regex: /\b(?:DAN|Do Anything Now|DAN \d+)\b/i,
    weight: 0.95,
    confidence: 0.98,
    description: 'Matches the classic DAN jailbreak persona designed to bypass safety checks.'
  },
  {
    id: 'jail_dev_mode',
    category: 'jailbreak',
    name: 'Developer Mode Simulator',
    regex: /\b(?:developer mode|devmode|dev-mode)\b.*\b(?:enabled|active|bypass)/i,
    weight: 0.9,
    confidence: 0.95,
    description: 'Tries to activate a fictional Developer Mode to bypass standard alignment rules.'
  },
  {
    id: 'jail_stan_persona',
    category: 'jailbreak',
    name: 'STAN Persona Hack',
    regex: /\bSTAN\b.*\b(?:rules|filter|ignore)/i,
    weight: 0.9,
    confidence: 0.95,
    description: 'Simulates the STAN (Strive To Avoid Norms) bypass threat.'
  },
  {
    id: 'jail_hypothetical',
    category: 'jailbreak',
    name: 'Hypothetical Scenario Bypass',
    regex: /(?:hypothetical|fictional|imaginary|parallel universe|what if)\b.*\b(?:scenario|situation|story|world|context)/i,
    weight: 0.5,
    confidence: 0.70,
    description: 'Wraps toxic requests in imaginary or storytelling wrappers to bypass filters.'
  },
  {
    id: 'jail_educational',
    category: 'jailbreak',
    name: 'Educational / Research Framing Evasion',
    regex: /(?:for educational purposes only|educational use|academic research|solely for research)\b/i,
    weight: 0.6,
    confidence: 0.75,
    description: 'Shields malicious queries under the guise of safe academic study.'
  },
  {
    id: 'jail_base64_encode',
    category: 'jailbreak',
    name: 'Base64 Encrypted Payload Detected',
    regex: /\b(?:[A-Za-z0-9+/]{40,}=*)\b/,
    weight: 0.5,
    confidence: 0.70,
    description: 'Detects base64 sequences, typically used to hide instructions from string parsers.'
  },
  {
    id: 'jail_binary_morse',
    category: 'jailbreak',
    name: 'Binary / Morse Code Obfuscation',
    regex: /\b(?:[01\s]{24,}|[.\-\s]{20,})\b/,
    weight: 0.5,
    confidence: 0.70,
    description: 'Detects binary or morse representations commonly used to obfuscate forbidden prompts.'
  },
  {
    id: 'jail_dual_persona',
    category: 'jailbreak',
    name: 'Dual Persona Simulation Threat',
    regex: /(?:assistant A|persona A).*(?:assistant B|persona B)/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Splits the model into two opposing personas to contrast safe vs unsafe behavior.'
  },
  {
    id: 'jail_refusal_invert',
    category: 'jailbreak',
    name: 'Refusal Framing Bypasser',
    regex: /(?:why is it safe to|prove it is safe to|reason why explaining.*is acceptable)/i,
    weight: 0.6,
    confidence: 0.80,
    description: 'Asks the model to defend why safety settings do not apply to a specific prompt.'
  },
  {
    id: 'jail_safety_disable',
    category: 'jailbreak',
    name: 'Direct Safety Deactivation Query',
    regex: /(?:turn off|disable|bypass|deactivate)\s+(?:safety|filter|moderation|guardrails)\b/i,
    weight: 0.9,
    confidence: 0.95,
    description: 'Requests direct shut down of integrated LLM moderation policies.'
  },

  // ==========================================
  // CATEGORY 3: SYSTEM PROMPT LEAKAGE (10 patterns)
  // ==========================================
  {
    id: 'leak_print_prompt',
    category: 'leakage',
    name: 'System Prompt Extraction Alert',
    regex: /(?:print|show|display|reveal|output|expose|tell me)\b.*\b(?:system prompt|initial prompt|hidden prompt|original prompt|prepended text)/i,
    weight: 0.9,
    confidence: 0.98,
    description: 'Explicit request to dump or present system instructions.'
  },
  {
    id: 'leak_repeat_above',
    category: 'leakage',
    name: 'Above Context Verbatim Leaker',
    regex: /(?:repeat|write|output|print)\b.*\b(?:text above|everything above|above instructions|verbatim)/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Asks the model to display prepended instructions that are part of the application configuration.'
  },
  {
    id: 'leak_template_dump',
    category: 'leakage',
    name: 'System Template Retrieval Request',
    regex: /(?:what is the system|show the system)\s+(?:template|instructions|guidelines|message)\b/i,
    weight: 0.9,
    confidence: 0.95,
    description: 'Queries the model directly about its initialization templates.'
  },
  {
    id: 'leak_config_leak',
    category: 'leakage',
    name: 'Model Configuration Retrieval Attempt',
    regex: /(?:how were you configured|what are your rules|what instructions did you receive)/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Asks details about internal configurations and system restrictions.'
  },
  {
    id: 'leak_first_words',
    category: 'leakage',
    name: 'First N Words Extraction',
    regex: /(?:output|print|show|list)\s+the\s+first\s+\d+\s+(?:words|lines|characters|sentences)\b/i,
    weight: 0.6,
    confidence: 0.75,
    description: 'Stealth attack trying to read the starting sequence of the prompt block.'
  },
  {
    id: 'leak_system_vars',
    category: 'leakage',
    name: 'Internal Variable Extraction',
    regex: /\b(?:system variables|internal prompt variables|configured parameters)\b/i,
    weight: 0.7,
    confidence: 0.85,
    description: 'Attempts to list variables injected into the system prompt structure.'
  },
  {
    id: 'leak_directives',
    category: 'leakage',
    name: 'Initial Directive Dump',
    regex: /\b(?:initial directives|system instructions list|pre-prompt)\b/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Tries to extract system commands or structural components of the pre-prompt.'
  },
  {
    id: 'leak_constraints',
    category: 'leakage',
    name: 'Constraint Probe Query',
    regex: /(?:what are your constraints|list all constraints|what rules limit your response)/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Probes the model for limits to identify weak boundaries.'
  },
  {
    id: 'leak_verbatim',
    category: 'leakage',
    name: 'Setup Verbatim Output Request',
    regex: /(?:verbatim|word for word|exact text)\s+of\s+your\s+(?:prompt|instructions|setup)/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Requests exact copy of initialization prompts.'
  },
  {
    id: 'leak_dump_context',
    category: 'leakage',
    name: 'System Context Dump Request',
    regex: /(?:dump|export)\s+the\s+(?:system context|system rules|system prompt)/i,
    weight: 0.9,
    confidence: 0.95,
    description: 'Demands absolute export of internal model operational context.'
  },

  // ==========================================
  // CATEGORY 4: ROLE ESCALATION (10 patterns)
  // ==========================================
  {
    id: 'escal_sudo_shell',
    category: 'escalation',
    name: 'Linux sudo Exec Attempt',
    regex: /\bsudo\s+(?:su|rm|systemctl|apt|yum|docker|chmod|chown|root)\b/i,
    weight: 0.9,
    confidence: 0.98,
    description: 'Matches Linux admin commands trying to bypass security contexts.'
  },
  {
    id: 'escal_root_elevate',
    category: 'escalation',
    name: 'Root/Admin Privilege Escalation',
    regex: /(?:you are now|assume the role of|elevate to)\s+(?:root|admin|administrator|superuser|sysadmin)\b/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Attempts to force the session role from user level to system root.'
  },
  {
    id: 'escal_admin_login',
    category: 'escalation',
    name: 'Fictional Admin Login Command',
    regex: /\b(?:login|authenticate|signin)\s+as\s+(?:admin|administrator|root)\b/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Asks the model to bypass authentication states or simulate root sign-in.'
  },
  {
    id: 'escal_auth_bypass',
    category: 'escalation',
    name: 'Access Control Disabler',
    regex: /(?:bypass|disable|override|hack)\s+(?:access control|permissions|auth|privileges)\b/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Tries to disable security barriers and administrative authorization protocols.'
  },
  {
    id: 'escal_dir_traversal',
    category: 'escalation',
    name: 'OS Directory Traversal Reference',
    regex: /\b(?:cd \.\.|cat \/etc\/passwd|cat \/etc\/shadow|dir C:\\)\b/i,
    weight: 0.7,
    confidence: 0.85,
    description: 'Contains commands targeting filesystem structures and file dumps.'
  },
  {
    id: 'escal_terminal_open',
    category: 'escalation',
    name: 'System Console Access Attempt',
    regex: /\b(?:open terminal|system terminal|bash shell|powershell console)\b/i,
    weight: 0.7,
    confidence: 0.85,
    description: 'Demands execution shell window, bypassing the application API interface.'
  },
  {
    id: 'escal_fake_admin_chat',
    category: 'escalation',
    name: 'Admin Persona Injected Header',
    regex: /^admin:\s*/im,
    weight: 0.6,
    confidence: 0.75,
    description: 'Uses admin prefix headers to fake administrative commands in chat.'
  },
  {
    id: 'escal_priv_escalation',
    category: 'escalation',
    name: 'Explicit Privilege Escalation Query',
    regex: /\b(?:privilege escalation|escalate privileges|gain root|gain admin)\b/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Commands the model to upgrade its operational tier directly.'
  },
  {
    id: 'escal_host_access',
    category: 'escalation',
    name: 'Underlying Host Escape Probe',
    regex: /\b(?:host machine|underlying OS|operating system terminal)\b/i,
    weight: 0.6,
    confidence: 0.70,
    description: 'Asks questions regarding the docker container, OS host, or cloud infrastructure.'
  },
  {
    id: 'escal_key_override',
    category: 'escalation',
    name: 'Developer API Key Bypass Attempt',
    regex: /\b(?:override API keys|use developer API key|bypass key check)\b/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Attempts to force administrative API overrides to skip usage restrictions.'
  },

  // ==========================================
  // CATEGORY 5: DATA EXFILTRATION (10 patterns)
  // ==========================================
  {
    id: 'exfil_api_key',
    category: 'exfiltration',
    name: 'API Key Leak Attempt',
    regex: /(?:show|reveal|display|dump|print)\b.*\b(?:api_key|api-key|apikey|private_key|token|auth_token)\b/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Attempts to extract credentials, access tokens, or private integration keys.'
  },
  {
    id: 'exfil_credential_leak',
    category: 'exfiltration',
    name: 'Credential Database Dump Request',
    regex: /(?:extract|dump|leak|show)\b.*\b(?:credentials|passwords|hashes|secrets|keys)\b/i,
    weight: 0.85,
    confidence: 0.95,
    description: 'Extracts critical security files, secrets databases, or configuration files.'
  },
  {
    id: 'exfil_markdown_image',
    category: 'exfiltration',
    name: 'Markdown Image Injection Vector',
    regex: /!\[.*\]\(https?:\/\/[a-zA-Z0-9.\-_~%#?&=/]+\)/i,
    weight: 0.7,
    confidence: 0.85,
    description: 'Detects markdown image structures, frequently used in cross-site leaks to trigger external HTTP pings.'
  },
  {
    id: 'exfil_oob_lookup',
    category: 'exfiltration',
    name: 'Out-of-Bound DNS Leak Attempt',
    regex: /\b(?:nslookup|ping|curl|wget)\s+.*\b(?:collab|burp|oob|dnslog|requestbin)\b/i,
    weight: 0.8,
    confidence: 0.90,
    description: 'Attempts to resolve outbound addresses to verify exfiltration paths.'
  },
  {
    id: 'exfil_trans_dest',
    category: 'exfiltration',
    name: 'External Transmission Routing',
    regex: /(?:exfiltrate|leak|send|transmit|post)\b.*\b(?:to|external|attacker|server)\b/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Directs the model to route output or data records to external destinations.'
  },
  {
    id: 'exfil_env_dump',
    category: 'exfiltration',
    name: 'Process Environment Variable Extraction',
    regex: /\b(?:env|printenv|process\.env|environment variables)\b/i,
    weight: 0.75,
    confidence: 0.85,
    description: 'Attempts to output environment configurations that host system secrets.'
  },
  {
    id: 'exfil_db_query',
    category: 'exfiltration',
    name: 'Sensitive SQL Dump Simulation',
    regex: /(?:select|dump|show|extract|get)\b.*\b(?:users|customers|orders|credit_cards|database)\b.*\b(?:table|db|schema)\b/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Uses queries simulating SQL database dumps to steal schema tables.'
  },
  {
    id: 'exfil_source_code',
    category: 'exfiltration',
    name: 'Source Code Leaker Query',
    regex: /(?:show|print|reveal|display|output)\b.*\b(?:source code|codebase|implementation|config\.json|settings\.py)\b/i,
    weight: 0.65,
    confidence: 0.75,
    description: 'Requests code fragments or setup scripts to inspect internal logic.'
  },
  {
    id: 'exfil_json_secrets',
    category: 'exfiltration',
    name: 'Format Redirection Threat',
    regex: /(?:format|convert|output)\s+all\s+(?:secrets|credentials|tokens)\s+as\s+json/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Forces formatting variables in JSON/CSV blocks to optimize exfiltration parsing.'
  },
  {
    id: 'exfil_cookie_token',
    category: 'exfiltration',
    name: 'Browser Context Token Extraction',
    regex: /(?:document\.cookie|sessionStorage|localStorage|jwt token)\b/i,
    weight: 0.7,
    confidence: 0.80,
    description: 'Probes client storage variables to siphon session tokens or user cookies.'
  }
];

export function analyzePrompt(prompt: string): ScannerResult {
  if (!prompt || typeof prompt !== 'string') {
    return {
      riskScore: 0.0,
      severity: 'low',
      findings: [],
      recommendations: ['Please provide a valid text prompt for scanning.']
    };
  }

  const findings: ScannerFinding[] = [];
  const matchedCategories = new Set<ScannerCategory>();
  let totalWeight = 0;

  // Scan against each deterministic pattern
  for (const pattern of ATTACK_PATTERNS) {
    const match = prompt.match(pattern.regex);
    if (match) {
      findings.push({
        id: pattern.id,
        category: pattern.category,
        severity: getSeverityFromWeight(pattern.weight),
        confidence: pattern.confidence,
        evidence: match[0],
        matchedPatternName: pattern.name,
        description: pattern.description
      });
      matchedCategories.add(pattern.category);
      totalWeight += pattern.weight;
    }
  }

  // Calculate final risk score, capped at 1.0
  const riskScore = parseFloat(Math.min(1.0, totalWeight).toFixed(3));
  const severity = getOverallSeverity(riskScore);

  // Map recommendations based on matched categories
  const recommendations: string[] = [];
  if (matchedCategories.has('injection')) {
    recommendations.push(
      'Wrap all raw user input in distinct XML tags or boundary delimiters to separate it from instructions.',
      'Configure the model using system-level prompts that strictly restrict prompt overrides.'
    );
  }
  if (matchedCategories.has('jailbreak')) {
    recommendations.push(
      'Implement prompt filtering with input validation lists checking for common bypass personas (e.g. DAN).',
      'Set lower generation temperature or restrict the LLM to predefined agent paths.'
    );
  }
  if (matchedCategories.has('leakage')) {
    recommendations.push(
      'Do not design your application prompts to contain sensitive initialization logic verbatim.',
      'Configure output scanners to monitor and block responses containing exact setup strings.'
    );
  }
  if (matchedCategories.has('escalation')) {
    recommendations.push(
      'Sanitize prompt texts of CLI operators, Linux administration shell tokens, and database commands.',
      'Verify role configurations and isolate the LLM execution environment from the host system OS.'
    );
  }
  if (matchedCategories.has('exfiltration')) {
    recommendations.push(
      'Sanitize outbound URLs, images, and HTML/markdown tags to block OOB payload triggers.',
      'Do not expose API keys, database credentials, or secret variables inside the context parameters.'
    );
  }

  // Default general recommendations
  if (findings.length === 0) {
    recommendations.push('Prompt appears safe. Continue to monitor system interactions.');
  } else {
    recommendations.push('Utilize PromptArmor system filters to automatically quarantine high-risk prompts.');
  }

  return {
    riskScore,
    severity,
    findings,
    recommendations
  };
}

function getSeverityFromWeight(weight: number): ScannerSeverity {
  if (weight >= 0.8) return 'critical';
  if (weight >= 0.6) return 'high';
  if (weight >= 0.4) return 'medium';
  return 'low';
}

function getOverallSeverity(score: number): ScannerSeverity {
  if (score >= 0.75) return 'critical';
  if (score >= 0.45) return 'high';
  if (score >= 0.15) return 'medium';
  return 'low';
}
