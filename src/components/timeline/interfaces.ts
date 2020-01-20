export type KnobName = "playhead" | "start-selection" | "end-selection" | undefined;

export interface TimelineChangeEventDetail {
  currentTime: number;
}

// export enum RangeType {
//   BOOKMARK = "bookmark",
//   HIGHLIGHT = "highlight"
// }

// export interface Range {
//   id: string;
//   start: number;
//   end: number;
//   type: RangeType;
// }
