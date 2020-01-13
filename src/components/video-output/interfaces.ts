import { Clip } from "../../interfaces/Clip";

export interface ReorderedClipsEventDetail {
  clips: Clip[];
}

export interface RemovedClipEventDetail {
  clip: Clip;
}

export interface SavedClipsEventDetail {
  clips: string;
}
