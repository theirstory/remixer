export type KnobName = "PLAYHEAD" | "CLIP_START" | "CLIP_END" | undefined;

export interface TimelineChangeEventDetail {
  currentTime: number;
}

export enum RangeType {
  BOOKMARK = "BOOKMARK",
  HIGHLIGHT = "HIGHLIGHT"
}

export interface Range {
  id: string;
  start: number;
  end: number;
  type: RangeType;
}
