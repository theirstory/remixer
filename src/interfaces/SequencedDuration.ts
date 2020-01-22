import { Duration } from "./Duration";

export interface SequencedDuration extends Duration {
  sequencedStart?: number;
  sequencedEnd?: number;
}
