import { AnnotationMap } from "./Annotation";

export interface AppState {
  annotations: AnnotationMap;
  remixing: boolean;
  remixedMedia: string | null;
  selectedMedia: string | null;
}
