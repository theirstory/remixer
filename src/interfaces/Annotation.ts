import { SequencedDuration } from "./SequencedDuration";

export enum Motivation {
  NONE = "none",
  BOOKMARKING = "bookmarking",
  COMMENTING = "commenting",
  EDITING = "editing",
  HIGHLIGHTING = "highlighting",
  MODERATING = "moderating",
  TAGGING = "tagging"
}

export interface Annotation extends SequencedDuration {
  body?: string;
  bodyDuration?: number;
  motivation?: Motivation;
  targetDuration?: number;
  label?: string;
}

export type AnnotationMap = Map<string, Annotation>;
export type AnnotationTuple = [string, Annotation];
