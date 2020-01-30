import { Duration } from "./Duration";

export enum SequencedDurationKeys {
  START = "start",
  END = "end",
  SEQUENCED_START = "sequencedStart",
  SEQUENCED_END = "sequencedEnd"
}

export interface SequencedDuration extends Duration {
  sequencedStart?: number;
  sequencedEnd?: number;
}
