export type KnobName = 'PLAYHEAD' | 'CLIP_START' | 'CLIP_END' | undefined;

export interface TimelineChangeEventDetail {
  currentTime: number;
}

export interface Range {
  id: string;
  start: number;
  end: number;
}
