import { AnnotationMap, Motivation } from "./Annotation";

export interface AppState {
  annotations: AnnotationMap;
  annotationMotivation: Motivation;
  remixing: boolean;
  remixedMedia: string | null;
  selectedAnnotation: string | null;
  selectedMedia: string | null;
}
