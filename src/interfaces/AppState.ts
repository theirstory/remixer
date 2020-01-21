import { Annotation } from "./Annotation";

export interface AppState {
  clips: Annotation[];
  remixing: boolean;
  remixedVideo: string | null;
  selectedVideo: string | null;
}
