
export type KnobName =
  | "playhead"
  | "start-selection"
  | "end-selection"
  | undefined;

export interface TimelineChangeEventDetail {
  currentTime: number;
}
