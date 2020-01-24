/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Annotation,
  AnnotationMap,
  AnnotationTuple,
} from './interfaces/Annotation';
import {
  SequencedDuration,
} from './interfaces/SequencedDuration';
import {
  Duration,
} from './interfaces/Duration';
import {
  TimelineChangeEventDetail,
} from './components/timeline/interfaces';

export namespace Components {
  interface TsAnnotationEditor {
    'annotations': AnnotationMap;
  }
  interface TsCuttingRoom {
    'media': string;
  }
  interface TsEditor {
    'annotations': AnnotationMap;
    'remixedMedia': string;
    'remixing': boolean;
  }
  interface TsMediaControls {
    'annotationEnabled': boolean;
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'highlights': AnnotationMap;
    'isPlaying': boolean;
    'selected': SequencedDuration | null;
  }
  interface TsMediaList {}
  interface TsMediaPlayer {
    'annotationEnabled': boolean;
    'annotations': AnnotationMap;
    'highlights': AnnotationMap;
    'pause': () => Promise<void>;
    'play': () => Promise<void>;
    'selected': string;
    'setCurrentTime': (currentTime: number) => Promise<void>;
    'stop': () => Promise<void>;
  }
  interface TsPlayButton {
    'disabled': boolean;
    'playing': boolean;
    'scrubbingWhilePlaying': boolean;
  }
  interface TsRemixer {}
  interface TsTime {
    'currentTime': number;
    'duration': number;
  }
  interface TsTimeline {
    'annotationEnabled': boolean;
    'annotations': AnnotationMap;
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'selected': Duration | null;
  }
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

  interface HTMLTsMediaControlsElement extends Components.TsMediaControls, HTMLStencilElement {}
  var HTMLTsMediaControlsElement: {
    prototype: HTMLTsMediaControlsElement;
    new (): HTMLTsMediaControlsElement;
  };

  interface HTMLTsMediaListElement extends Components.TsMediaList, HTMLStencilElement {}
  var HTMLTsMediaListElement: {
    prototype: HTMLTsMediaListElement;
    new (): HTMLTsMediaListElement;
  };

  interface HTMLTsMediaPlayerElement extends Components.TsMediaPlayer, HTMLStencilElement {}
  var HTMLTsMediaPlayerElement: {
    prototype: HTMLTsMediaPlayerElement;
    new (): HTMLTsMediaPlayerElement;
  };

  interface HTMLTsPlayButtonElement extends Components.TsPlayButton, HTMLStencilElement {}
  var HTMLTsPlayButtonElement: {
    prototype: HTMLTsPlayButtonElement;
    new (): HTMLTsPlayButtonElement;
  };

  interface HTMLTsRemixerElement extends Components.TsRemixer, HTMLStencilElement {}
  var HTMLTsRemixerElement: {
    prototype: HTMLTsRemixerElement;
    new (): HTMLTsRemixerElement;
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
  interface HTMLElementTagNameMap {
    'ts-annotation-editor': HTMLTsAnnotationEditorElement;
    'ts-cutting-room': HTMLTsCuttingRoomElement;
    'ts-editor': HTMLTsEditorElement;
    'ts-media-controls': HTMLTsMediaControlsElement;
    'ts-media-list': HTMLTsMediaListElement;
    'ts-media-player': HTMLTsMediaPlayerElement;
    'ts-play-button': HTMLTsPlayButtonElement;
    'ts-remixer': HTMLTsRemixerElement;
    'ts-time': HTMLTsTimeElement;
    'ts-timeline': HTMLTsTimelineElement;
  }
}

declare namespace LocalJSX {
  interface TsAnnotationEditor {
    'annotations'?: AnnotationMap;
    'onAnnotationClick'?: (event: CustomEvent<string>) => void;
    'onAnnotationMouseOut'?: (event: CustomEvent<string>) => void;
    'onAnnotationMouseOver'?: (event: CustomEvent<string>) => void;
    'onDeleteAnnotation'?: (event: CustomEvent<string>) => void;
    'onReorderAnnotations'?: (event: CustomEvent<AnnotationMap>) => void;
  }
  interface TsCuttingRoom {
    'media'?: string;
    'onEdit'?: (event: CustomEvent<Annotation>) => void;
  }
  interface TsEditor {
    'annotations'?: AnnotationMap;
    'onDeleteAnnotation'?: (event: CustomEvent<string>) => void;
    'onReorderAnnotations'?: (event: CustomEvent<AnnotationMap>) => void;
    'onSave'?: (event: CustomEvent<string>) => void;
    'onUpdateAnnotation'?: (event: CustomEvent<AnnotationTuple>) => void;
    'remixedMedia'?: string;
    'remixing'?: boolean;
  }
  interface TsMediaControls {
    'annotationEnabled'?: boolean;
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'highlights'?: AnnotationMap;
    'isPlaying'?: boolean;
    'onAnnotation'?: (event: CustomEvent<Duration>) => void;
    'onAnnotationSelectionChange'?: (event: CustomEvent<Duration>) => void;
    'onPause'?: (event: CustomEvent<any>) => void;
    'onPlay'?: (event: CustomEvent<any>) => void;
    'onScrub'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubEnd'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubStart'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'selected'?: SequencedDuration | null;
  }
  interface TsMediaList {
    'onMediaSelected'?: (event: CustomEvent<string>) => void;
  }
  interface TsMediaPlayer {
    'annotationEnabled'?: boolean;
    'annotations'?: AnnotationMap;
    'highlights'?: AnnotationMap;
    'onAnnotation'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationSelectionChange'?: (event: CustomEvent<Annotation>) => void;
    'selected'?: string;
  }
  interface TsPlayButton {
    'disabled'?: boolean;
    'onPause'?: (event: CustomEvent<any>) => void;
    'onPlay'?: (event: CustomEvent<any>) => void;
    'playing'?: boolean;
    'scrubbingWhilePlaying'?: boolean;
  }
  interface TsRemixer {}
  interface TsTime {
    'currentTime'?: number;
    'duration'?: number;
  }
  interface TsTimeline {
    'annotationEnabled'?: boolean;
    'annotations'?: AnnotationMap;
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'onAnnotationChange'?: (event: CustomEvent<Duration>) => void;
    'onAnnotationEnd'?: (event: CustomEvent<Duration>) => void;
    'onAnnotationSelectionChange'?: (event: CustomEvent<Duration>) => void;
    'onAnnotationStart'?: (event: CustomEvent<Duration>) => void;
    'onScrub'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubEnd'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubStart'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'selected'?: Duration | null;
  }

  interface IntrinsicElements {
    'ts-annotation-editor': TsAnnotationEditor;
    'ts-cutting-room': TsCuttingRoom;
    'ts-editor': TsEditor;
    'ts-media-controls': TsMediaControls;
    'ts-media-list': TsMediaList;
    'ts-media-player': TsMediaPlayer;
    'ts-play-button': TsPlayButton;
    'ts-remixer': TsRemixer;
    'ts-time': TsTime;
    'ts-timeline': TsTimeline;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'ts-annotation-editor': LocalJSX.TsAnnotationEditor & JSXBase.HTMLAttributes<HTMLTsAnnotationEditorElement>;
      'ts-cutting-room': LocalJSX.TsCuttingRoom & JSXBase.HTMLAttributes<HTMLTsCuttingRoomElement>;
      'ts-editor': LocalJSX.TsEditor & JSXBase.HTMLAttributes<HTMLTsEditorElement>;
      'ts-media-controls': LocalJSX.TsMediaControls & JSXBase.HTMLAttributes<HTMLTsMediaControlsElement>;
      'ts-media-list': LocalJSX.TsMediaList & JSXBase.HTMLAttributes<HTMLTsMediaListElement>;
      'ts-media-player': LocalJSX.TsMediaPlayer & JSXBase.HTMLAttributes<HTMLTsMediaPlayerElement>;
      'ts-play-button': LocalJSX.TsPlayButton & JSXBase.HTMLAttributes<HTMLTsPlayButtonElement>;
      'ts-remixer': LocalJSX.TsRemixer & JSXBase.HTMLAttributes<HTMLTsRemixerElement>;
      'ts-time': LocalJSX.TsTime & JSXBase.HTMLAttributes<HTMLTsTimeElement>;
      'ts-timeline': LocalJSX.TsTimeline & JSXBase.HTMLAttributes<HTMLTsTimelineElement>;
    }
  }
}


