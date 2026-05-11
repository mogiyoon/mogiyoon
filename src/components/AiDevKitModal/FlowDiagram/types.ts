import type { AiDevKitFlowLoop, AiDevKitStepDetail } from '../types';

export interface FlowStep {
  /** index 는 0-based 이며 항상 원본 steps 배열로 매핑된다. */
  step: string;
  index: number;
  detail?: AiDevKitStepDetail;
}

export interface FlowDiagramProps {
  idBase: string;
  steps: string[];
  loops?: AiDevKitFlowLoop[];
  stepDetails?: AiDevKitStepDetail[];
}

/** Desktop layout: top-level block (normal step or one loop cluster). */
export type FlowBlock =
  | { type: 'step'; width: number; stepItem: FlowStep }
  | { type: 'loop'; width: number; stepItem: null };
