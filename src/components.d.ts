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
  Motivation,
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
import {
  Data,
} from './interfaces/Data';
import {
  TextEditEventDetail,
} from './components/text-editor/interfaces';

export namespace Components {
  interface TsAnnotationEditor {
    'annotations': AnnotationMap;
    'motivation': Motivation;
    'selectedAnnotation': AnnotationTuple | null;
  }
  interface TsArchiveRoom {}
  interface TsConsole {
    'data': string | null;
    'disabled': boolean;
    'tabSize': number;
  }
  interface TsCuttingRoom {
    'media': string;
  }
  interface TsEditingRoom {
    'annotationMotivation': Motivation;
    'annotations': AnnotationMap;
    'remixedMedia': string;
    'remixing': boolean;
    'selectedAnnotation': AnnotationTuple | null;
  }
  interface TsMediaControls {
    'annotationEnabled': boolean;
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'highlights': AnnotationMap | null;
    'isPlaying': boolean;
    'selected': SequencedDuration | null;
  }
  interface TsMediaPlayer {
    'annotationEnabled': boolean;
    'annotationMotivation': Motivation;
    'clips': AnnotationMap;
    'highlights': AnnotationMap | null;
    'movePlayheadOnSelect': boolean;
    'pause': () => Promise<void>;
    'play': () => Promise<void>;
    'selected': Annotation | null;
    'stop': () => Promise<void>;
  }
  interface TsPlayButton {
    'disabled': boolean;
    'playing': boolean;
    'scrubbingWhilePlaying': boolean;
  }
  interface TsRemixer {
    'debugConsoleEnabled': boolean;
    'setData': (data: Data) => Promise<void>;
  }
  interface TsTextEditor {
    'description': string;
    'descriptionEnabled': boolean;
    'label': string;
  }
  interface TsTime {
    'currentTime': number;
    'duration': number;
  }
  interface TsTimeline {
    'annotationEnabled': boolean;
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'highlights': AnnotationMap | null;
    'selected': Duration | null;
  }
}

declare global {


  interface HTMLTsAnnotationEditorElement extends Components.TsAnnotationEditor, HTMLStencilElement {}
  var HTMLTsAnnotationEditorElement: {
    prototype: HTMLTsAnnotationEditorElement;
    new (): HTMLTsAnnotationEditorElement;
  };

  interface HTMLTsArchiveRoomElement extends Components.TsArchiveRoom, HTMLStencilElement {}
  var HTMLTsArchiveRoomElement: {
    prototype: HTMLTsArchiveRoomElement;
    new (): HTMLTsArchiveRoomElement;
  };

  interface HTMLTsConsoleElement extends Components.TsConsole, HTMLStencilElement {}
  var HTMLTsConsoleElement: {
    prototype: HTMLTsConsoleElement;
    new (): HTMLTsConsoleElement;
  };

  interface HTMLTsCuttingRoomElement extends Components.TsCuttingRoom, HTMLStencilElement {}
  var HTMLTsCuttingRoomElement: {
    prototype: HTMLTsCuttingRoomElement;
    new (): HTMLTsCuttingRoomElement;
  };

  interface HTMLTsEditingRoomElement extends Components.TsEditingRoom, HTMLStencilElement {}
  var HTMLTsEditingRoomElement: {
    prototype: HTMLTsEditingRoomElement;
    new (): HTMLTsEditingRoomElement;
  };

  interface HTMLTsMediaControlsElement extends Components.TsMediaControls, HTMLStencilElement {}
  var HTMLTsMediaControlsElement: {
    prototype: HTMLTsMediaControlsElement;
    new (): HTMLTsMediaControlsElement;
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

  interface HTMLTsTextEditorElement extends Components.TsTextEditor, HTMLStencilElement {}
  var HTMLTsTextEditorElement: {
    prototype: HTMLTsTextEditorElement;
    new (): HTMLTsTextEditorElement;
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
    'ts-archive-room': HTMLTsArchiveRoomElement;
    'ts-console': HTMLTsConsoleElement;
    'ts-cutting-room': HTMLTsCuttingRoomElement;
    'ts-editing-room': HTMLTsEditingRoomElement;
    'ts-media-controls': HTMLTsMediaControlsElement;
    'ts-media-player': HTMLTsMediaPlayerElement;
    'ts-play-button': HTMLTsPlayButtonElement;
    'ts-remixer': HTMLTsRemixerElement;
    'ts-text-editor': HTMLTsTextEditorElement;
    'ts-time': HTMLTsTimeElement;
    'ts-timeline': HTMLTsTimelineElement;
  }
}

declare namespace LocalJSX {
  interface TsAnnotationEditor {
    'annotations'?: AnnotationMap;
    'motivation'?: Motivation;
    'onAnnotationMouseOut'?: (event: CustomEvent<AnnotationTuple>) => void;
    'onAnnotationMouseOver'?: (event: CustomEvent<AnnotationTuple>) => void;
    'onDeleteAnnotation'?: (event: CustomEvent<AnnotationTuple>) => void;
    'onReorderAnnotations'?: (event: CustomEvent<AnnotationMap>) => void;
    'onSelectAnnotation'?: (event: CustomEvent<AnnotationTuple>) => void;
    'onSelectAnnotationMotivation'?: (event: CustomEvent<Motivation>) => void;
    'onSetAnnotation'?: (event: CustomEvent<AnnotationTuple>) => void;
    'selectedAnnotation'?: AnnotationTuple | null;
  }
  interface TsArchiveRoom {
    'onMediaSelected'?: (event: CustomEvent<string>) => void;
  }
  interface TsConsole {
    'data'?: string | null;
    'disabled'?: boolean;
    'onSet'?: (event: CustomEvent<any>) => void;
    'tabSize'?: number;
  }
  interface TsCuttingRoom {
    'media'?: string;
    'onEdit'?: (event: CustomEvent<Annotation>) => void;
  }
  interface TsEditingRoom {
    'annotationMotivation'?: Motivation;
    'annotations'?: AnnotationMap;
    'onDeleteAnnotation'?: (event: CustomEvent<string>) => void;
    'onReorderAnnotations'?: (event: CustomEvent<AnnotationMap>) => void;
    'onSave'?: (event: CustomEvent<string>) => void;
    'onSelectAnnotation'?: (event: CustomEvent<string>) => void;
    'onSelectAnnotationMotivation'?: (event: CustomEvent<Motivation>) => void;
    'onSetAnnotation'?: (event: CustomEvent<AnnotationTuple>) => void;
    'remixedMedia'?: string;
    'remixing'?: boolean;
    'selectedAnnotation'?: AnnotationTuple | null;
  }
  interface TsMediaControls {
    'annotationEnabled'?: boolean;
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'highlights'?: AnnotationMap | null;
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
  interface TsMediaPlayer {
    'annotationEnabled'?: boolean;
    'annotationMotivation'?: Motivation;
    'clips'?: AnnotationMap;
    'highlights'?: AnnotationMap | null;
    'movePlayheadOnSelect'?: boolean;
    'onAnnotation'?: (event: CustomEvent<Annotation>) => void;
    'onAnnotationSelectionChange'?: (event: CustomEvent<Annotation>) => void;
    'selected'?: Annotation | null;
  }
  interface TsPlayButton {
    'disabled'?: boolean;
    'onPause'?: (event: CustomEvent<any>) => void;
    'onPlay'?: (event: CustomEvent<any>) => void;
    'playing'?: boolean;
    'scrubbingWhilePlaying'?: boolean;
  }
  interface TsRemixer {
    'debugConsoleEnabled'?: boolean;
    'onLoad'?: (event: CustomEvent<string>) => void;
  }
  interface TsTextEditor {
    'description'?: string;
    'descriptionEnabled'?: boolean;
    'label'?: string;
    'onChange'?: (event: CustomEvent<TextEditEventDetail>) => void;
    'onClose'?: (event: CustomEvent<CustomEvent>) => void;
  }
  interface TsTime {
    'currentTime'?: number;
    'duration'?: number;
  }
  interface TsTimeline {
    'annotationEnabled'?: boolean;
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'highlights'?: AnnotationMap | null;
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
    'ts-archive-room': TsArchiveRoom;
    'ts-console': TsConsole;
    'ts-cutting-room': TsCuttingRoom;
    'ts-editing-room': TsEditingRoom;
    'ts-media-controls': TsMediaControls;
    'ts-media-player': TsMediaPlayer;
    'ts-play-button': TsPlayButton;
    'ts-remixer': TsRemixer;
    'ts-text-editor': TsTextEditor;
    'ts-time': TsTime;
    'ts-timeline': TsTimeline;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'ts-annotation-editor': LocalJSX.TsAnnotationEditor & JSXBase.HTMLAttributes<HTMLTsAnnotationEditorElement>;
      'ts-archive-room': LocalJSX.TsArchiveRoom & JSXBase.HTMLAttributes<HTMLTsArchiveRoomElement>;
      'ts-console': LocalJSX.TsConsole & JSXBase.HTMLAttributes<HTMLTsConsoleElement>;
      'ts-cutting-room': LocalJSX.TsCuttingRoom & JSXBase.HTMLAttributes<HTMLTsCuttingRoomElement>;
      'ts-editing-room': LocalJSX.TsEditingRoom & JSXBase.HTMLAttributes<HTMLTsEditingRoomElement>;
      'ts-media-controls': LocalJSX.TsMediaControls & JSXBase.HTMLAttributes<HTMLTsMediaControlsElement>;
      'ts-media-player': LocalJSX.TsMediaPlayer & JSXBase.HTMLAttributes<HTMLTsMediaPlayerElement>;
      'ts-play-button': LocalJSX.TsPlayButton & JSXBase.HTMLAttributes<HTMLTsPlayButtonElement>;
      'ts-remixer': LocalJSX.TsRemixer & JSXBase.HTMLAttributes<HTMLTsRemixerElement>;
      'ts-text-editor': LocalJSX.TsTextEditor & JSXBase.HTMLAttributes<HTMLTsTextEditorElement>;
      'ts-time': LocalJSX.TsTime & JSXBase.HTMLAttributes<HTMLTsTimeElement>;
      'ts-timeline': LocalJSX.TsTimeline & JSXBase.HTMLAttributes<HTMLTsTimelineElement>;
    }
  }
}


