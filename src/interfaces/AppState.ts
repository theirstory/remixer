import { Clip } from "./clip";

export interface AppState {
  clips: Clip[];
  mergedVideo: string | null;
  selectedVideo: string | null;
}
