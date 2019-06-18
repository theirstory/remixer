export interface Clip {
  id: number;
  source: string;
  start: number;
  end: number;
  sequencedStart: number;
  sequencedEnd: number;
  encoding: string;
  isCurrent: boolean;
}
