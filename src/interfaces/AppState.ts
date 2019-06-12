import { Clip } from "./clip";

export interface AppState {
  selectedVideo: string | null;
  clips: Clip[];
}
