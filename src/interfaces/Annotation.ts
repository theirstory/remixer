export enum Motivation {
  BOOKMARKING = "bookmarking",
  COMMENTING = "commenting",
  EDITING = "editing",
  HIGHLIGHTING = "highlighting",
  MODERATING = "moderating",
  TAGGING = "tagging"
}

export interface Annotation {
  id?: string;
  start?: number;
  end?: number;
  target?: string;
  motivation?: Motivation;
}
