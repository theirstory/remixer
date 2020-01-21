/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Annotation,
} from './interfaces/Annotation';
import {
  TimelineChangeEventDetail,
} from './components/timeline/interfaces';

export namespace Components {
  interface TsAnnotationEditor {
    'annotations': Annotation[];
  }
  interface TsCuttingRoom {
    'video': string;
  }
  interface TsEditor {
    'clips': Annotation[];
    'remixedVideo': string;
    'remixing': boolean;
  }
  interface TsPlayButton {
    'disabled': boolean;
    'playing': boolean;
    'scrubbingWhilePlaying': boolean;
  }
  interface TsTime {
    'currentTime': number;
    'duration': number;
  }
  interface TsTimeline {
    'annotationEnabled': boolean;
    'annotations': Annotation[];
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'selected': Annotation;
  }
  interface TsTimelineActions {
    'annotation': Annotation;
    'annotationEnabled': boolean;
    'editingEnabled': boolean;
  }
  interface TsVideoControls {
    'annotationEnabled': boolean;
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'highlights': Annotation[];
    'isPlaying': boolean;
    'selected': Annotation;
  }
  interface TsVideoList {}
  interface TsVideoPlayer {
    'annotationEnabled': boolean;
    'clips': Annotation[];
    'highlights': Annotation[] | null;
    'pause': () => Promise<void>;
    'play': () => Promise<void>;
    'selectAnnotation': (annotation: Annotation) => Promise<void>;
    'setCurrentTime': (currentTime: number) => Promise<void>;
    'stop': () => Promise<void>;
  }
  interface TsVideoRemixer {}
}

declare global {


  interface HTMLTsAnnotationEditorElement extends Components.TsAnnotationEditor, HTMLStencilElement {}
  var HTMLTsAnnotationEditorElement: {
    prototype: HTMLTsAnnotationEditorElement;
    new (): HTMLTsAnnotationEditorElement;
  };

  interface HTMLTsCuttingRoomElement extends Components.TsCuttingRoom, HTMLStencilElement {}
  var HTMLTsCuttingRoomElement: {
    prototype: HTMLTsCuttingRoomElement;
    new (): HTMLTsCuttingRoomElement;
  };

  interface HTMLTsEditorElement extends Components.TsEditor, HTMLStencilElement {}
  var HTMLTsEditorElement: {
    prototype: HTMLTsEditorElement;
    new (): HTMLTsEditorElement;
  };

  interface HTMLTsPlayButtonElement extends Components.TsPlayButton, HTMLStencilElement {}
  var HTMLTsPlayButtonElement: {
    prototype: HTMLTsPlayButtonElement;
    new (): HTMLTsPlayButtonElement;
  };

  interface HTMLTsTimeElement extends Components.TsTime, HTMLStencilElement {}
  var HTMLTsTimeElement: {
    prototype: HTMLTsTimeElement;
    new (): HTMLTsTimeElement;
  };

  interface HTMLTsTimelineElement extends Components.TsTimeline, HTMLStencilElement {}
  var HTMLTsTimelineElement: {
    prototype: HTMLTsTimelineElement;
    new (): HTMLTsTimelineElement;
  };

  interface HTMLTsTimelineActionsElement extends Components.TsTimelineActions, HTMLStencilElement {}
  var HTMLTsTimelineActionsElement: {
    prototype: HTMLTsTimelineActionsElement;
    new (): HTMLTsTimelineActionsElement;
  };

  interface HTMLTsVideoControlsElement extends Components.TsVideoControls, HTMLStencilElement {}
  var HTMLTsVideoControlsElement: {
    prototype: HTMLTsVideoControlsElement;
    new (): HTMLTsVideoControlsElement;
  };

  interface HTMLTsVideoListElement extends Components.TsVideoList, HTMLStencilElement {}
  var HTMLTsVideoListElement: {
    prototype: HTMLTsVideoListElement;
    new (): HTMLTsVideoListElement;
  };

  interface HTMLTsVideoPlayerElement extends Components.TsVideoPlayer, HTMLStencilElement {}
  var HTMLTsVideoPlayerElement: {
    prototype: HTMLTsVideoPlayerElement;
    new (): HTMLTsVideoPlayerElement;
  };

  interface HTMLTsVideoRemixerElement extends Components.TsVideoRemixer, HTMLStencilElement {}
  var HTMLTsVideoRemixerElement: {
    prototype: HTMLTsVideoRemixerElement;
    new (): HTMLTsVideoRemixerElement;
  };
  interface HTMLElementTagNameMap {
    'ts-annotation-editor': HTMLTsAnnotationEditorElement;
    'ts-cutting-room': HTMLTsCuttingRoomElement;
    'ts-editor': HTMLTsEditorElement;
    'ts-play-button': HTMLTsPlayButtonElement;
    'ts-time': HTMLTsTimeElement;
    'ts-timeline': HTMLTsTimelineElement;
    'ts-timeline-actions': HTMLTsTimelineActionsElement;
    'ts-video-controls': HTMLTsVideoControlsElement;
    'ts-video-list': HTMLTsVideoListElement;
    'ts-video-player': HTMLTsVideoPlayerElement;
    'ts-video-remixer': HTMLTsVideoRemixerElement;
  }
}

declare namespace LocalJSX {
  interface TsAnnotationEditor {
    'annotations'?: Annotation[];
    'onAnnotationClick'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationMouseOut'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationMouseOver'?: (event: CustomEvent<Annotation>) => void;
    'onDeleteAnnotation'?: (event: CustomEvent<Annotation>) => void;
    'onReorderedAnnotations'?: (event: CustomEvent<Annotation[]>) => void;
  }
  interface TsCuttingRoom {
    'onEdit'?: (event: CustomEvent<Annotation>) => void;
    'video'?: string;
  }
  interface TsEditor {
    'clips'?: Annotation[];
    'onRemovedClip'?: (event: CustomEvent<Annotation>) => void;
    'onReorderedClips'?: (event: CustomEvent<Annotation[]>) => void;
    'onSave'?: (event: CustomEvent<string>) => void;
    'remixedVideo'?: string;
    'remixing'?: boolean;
  }
  interface TsPlayButton {
    'disabled'?: boolean;
    'onPause'?: (event: CustomEvent<any>) => void;
    'onPlay'?: (event: CustomEvent<any>) => void;
    'playing'?: boolean;
    'scrubbingWhilePlaying'?: boolean;
  }
  interface TsTime {
    'currentTime'?: number;
    'duration'?: number;
  }
  interface TsTimeline {
    'annotationEnabled'?: boolean;
    'annotations'?: Annotation[];
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'onAnnotationChange'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationEnd'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationSelectionChange'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationStart'?: (event: CustomEvent<Annotation>) => void;
    'onScrub'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubEnd'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubStart'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'selected'?: Annotation;
  }
  interface TsTimelineActions {
    'annotation'?: Annotation;
    'annotationEnabled'?: boolean;
    'editingEnabled'?: boolean;
    'onAnnotate'?: (event: CustomEvent<Annotation>) => void;
    'onEdit'?: (event: CustomEvent<Annotation>) => void;
  }
  interface TsVideoControls {
    'annotationEnabled'?: boolean;
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'highlights'?: Annotation[];
    'isPlaying'?: boolean;
    'onAnnotation'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationSelectionChange'?: (event: CustomEvent<Annotation>) => void;
    'onPause'?: (event: CustomEvent<any>) => void;
    'onPlay'?: (event: CustomEvent<any>) => void;
    'onScrub'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubEnd'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubStart'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'selected'?: Annotation;
  }
  interface TsVideoList {
    'onVideoSelected'?: (event: CustomEvent<string>) => void;
  }
  interface TsVideoPlayer {
    'annotationEnabled'?: boolean;
    'clips'?: Annotation[];
    'highlights'?: Annotation[] | null;
    'onAnnotation'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationSelectionChange'?: (event: CustomEvent<Annotation>) => void;
  }
  interface TsVideoRemixer {}

  interface IntrinsicElements {
    'ts-annotation-editor': TsAnnotationEditor;
    'ts-cutting-room': TsCuttingRoom;
    'ts-editor': TsEditor;
    'ts-play-button': TsPlayButton;
    'ts-time': TsTime;
    'ts-timeline': TsTimeline;
    'ts-timeline-actions': TsTimelineActions;
    'ts-video-controls': TsVideoControls;
    'ts-video-list': TsVideoList;
    'ts-video-player': TsVideoPlayer;
    'ts-video-remixer': TsVideoRemixer;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'ts-annotation-editor': LocalJSX.TsAnnotationEditor & JSXBase.HTMLAttributes<HTMLTsAnnotationEditorElement>;
      'ts-cutting-room': LocalJSX.TsCuttingRoom & JSXBase.HTMLAttributes<HTMLTsCuttingRoomElement>;
      'ts-editor': LocalJSX.TsEditor & JSXBase.HTMLAttributes<HTMLTsEditorElement>;
      'ts-play-button': LocalJSX.TsPlayButton & JSXBase.HTMLAttributes<HTMLTsPlayButtonElement>;
      'ts-time': LocalJSX.TsTime & JSXBase.HTMLAttributes<HTMLTsTimeElement>;
      'ts-timeline': LocalJSX.TsTimeline & JSXBase.HTMLAttributes<HTMLTsTimelineElement>;
      'ts-timeline-actions': LocalJSX.TsTimelineActions & JSXBase.HTMLAttributes<HTMLTsTimelineActionsElement>;
      'ts-video-controls': LocalJSX.TsVideoControls & JSXBase.HTMLAttributes<HTMLTsVideoControlsElement>;
      'ts-video-list': LocalJSX.TsVideoList & JSXBase.HTMLAttributes<HTMLTsVideoListElement>;
      'ts-video-player': LocalJSX.TsVideoPlayer & JSXBase.HTMLAttributes<HTMLTsVideoPlayerElement>;
      'ts-video-remixer': LocalJSX.TsVideoRemixer & JSXBase.HTMLAttributes<HTMLTsVideoRemixerElement>;
    }
  }
}


