import { Annotation } from "./Annotation";

export interface Clip extends Annotation {
  sequencedStart?: number;
  sequencedEnd?: number;
}
