import { Clip } from "./clip";

export interface AppState {
  clips: Clip[];
  remixing: boolean;
  remixedVideo: string | null;
  selectedVideo: string | null;
}
