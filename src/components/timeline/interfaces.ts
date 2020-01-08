export type KnobName = 'PLAYHEAD' | 'CLIP_START' | 'CLIP_END' | undefined;

export interface TimelineChangeEventDetail {
  currentTime: number;
}
