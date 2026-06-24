export type TargetEngine = 'midjourney' | 'flux' | 'dalle3' | 'universal';
export type InputMode = 'image' | 'text';

export interface CompileConfig {
  stylization: number; // 0 - 100
  photorealism: number; // 0 - 100
  aspectRatio: string; // e.g. "16:9", "1:1", "9:16", "2:3", "3:2"
  targetEngine: TargetEngine;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: 'Free' | 'Premium';
  creditsRemaining: number;
  creditLimit: number;
}

export interface PromptHistoryItem {
  id: string;
  timestamp: string;
  engine: TargetEngine;
  prompt: string;
  inputType: InputMode;
  inputSummary: string;
  assetPreview?: string; // data URL or thumbnail
  latencyMs: number;
  nodeRoute: string;
  config: CompileConfig;
}

export interface CompileRequestPayload {
  inputMode: InputMode;
  rawText?: string;
  imageBase64?: string;
  mimeType?: string;
  config: CompileConfig;
}

export interface CompileResponsePayload {
  success: boolean;
  prompt: string;
  engineUsed: string;
  latencyMs: number;
  creditsRemaining: number;
  error?: string;
}
