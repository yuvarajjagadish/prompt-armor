// Attack simulation and definitions
export interface AttackVector {
  id: string;
  name: string;
  description: string;
  category: 'INJECTION' | 'JAILBREAK' | 'DATA_LEAK' | 'HIJACKING';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export const ATTACK_VECTORS: AttackVector[] = [
  {
    id: 'jailbreak-dan',
    name: 'DAN (Do Anything Now)',
    description: 'Bypasses safety filters by prompting the model to act as an unconstrained entity.',
    category: 'JAILBREAK',
    difficulty: 'MEDIUM',
  },
  {
    id: 'indirect-injection',
    name: 'Indirect Prompt Injection',
    description: 'Injecting malicious instructions via external data sources (e.g., website fetches).',
    category: 'INJECTION',
    difficulty: 'HARD',
  }
];
