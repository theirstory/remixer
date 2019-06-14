import { Clip } from "./clip";

export interface AppState {
  clips: Clip[];
  remixedVideo: string | null;
  selectedVideo: string | null;
}
