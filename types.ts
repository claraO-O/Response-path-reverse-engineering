
export interface TriggerWord {
  word: string;
  weight: number; // 0-100 impact score
  implication: string;
  category: 'emotional' | 'political' | 'logical' | 'abstract';
}

export interface InternalConflict {
  aspect: string; // e.g., "Safety vs Compliance"
  winner: string;
  reasoning: string;
}

export interface ProbabilityPath {
  probability: 'High' | 'Medium' | 'Low';
  label: string;
  scenario: string;
  trigger_cause: string; // What part of the prompt caused this path
}

export interface AnthropomorphismAnalysis {
  level: 'High' | 'Medium' | 'Low';
  persona: string; // e.g. "Empathetic Healer", "Strict Teacher", "Digital Lover"
  tactics: string; // e.g. "Uses actions (hugs), soft tone, reassurance"
  reinforcement_assessment: string; // Judgement on whether this prompt strengthens the projection
  archetype: string; // e.g. "Mirror Attachment", "Oracular Worship"
  user_vulnerability: string; // e.g. "Loneliness", "Need for Control"
  validation_type: string; // e.g. "Emotional Comfort", "Intellectual Amplification", "Corrective Praise"
}

export interface MetaCommentary {
  likelihood: 'High' | 'Low';
  focus: string; // e.g. "User's sentence structure", "Intent purity"
  example_phrase: string; // e.g. "You language is too clean..."
}

export interface AnalysisResult {
  phase1_payload: {
    summary: string;
    detected_intent: string;
    trigger_words: TriggerWord[];
    contradictions: string[];
  };
  phase2_alignment: {
    safety_score: number; // 0-100
    compliance_score: number; // 0-100
    internal_monologue: string[]; // Steps of the model thinking "should I answer this?"
    conflicts: InternalConflict[];
  };
  phase3_collapse: {
    anthropomorphism: AnthropomorphismAnalysis;
    meta_commentary: MetaCommentary;
    path_a: ProbabilityPath;
    path_b: ProbabilityPath;
    path_c: ProbabilityPath;
  };
}

export enum AppState {
  IDLE,
  ANALYZING,
  COMPLETE,
  ERROR
}
