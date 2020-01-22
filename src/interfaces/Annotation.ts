import { SequencedDuration } from "./SequencedDuration";

export enum Motivation {
  BOOKMARKING = "bookmarking",
  COMMENTING = "commenting",
  EDITING = "editing",
  HIGHLIGHTING = "highlighting",
  MODERATING = "moderating",
  TAGGING = "tagging"
}

export interface Annotation extends SequencedDuration {
  target?: string;
  motivation?: Motivation;
}

export type AnnotationMap = Map<string, Annotation>;
export type AnnotationMapTuple = [string, Annotation];
