/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Range,
  TimelineChangeEventDetail,
} from './components/timeline/interfaces';
import {
  Clip,
} from './interfaces/Clip';
import {
  ClipChangeEventDetail,
} from './components/video-controls/interfaces';

export namespace Components {
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
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'ranges': Range[];
    'selectionEnabled': boolean;
    'selectionHandleWidth': number;
  }
  interface TsVideoClipSelector {
    'video': string;
  }
  interface TsVideoControls {
    'clipSelectionEnabled': boolean;
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'isPlaying': boolean;
    'ranges': Range[];
  }
  interface TsVideoList {}
  interface TsVideoOutput {
    'clips': Clip[];
    'remixedVideo': string;
    'remixing': boolean;
  }
  interface TsVideoPlayer {
    'clipSelectionEnabled': boolean;
    'clips': Clip[];
    'pause': () => Promise<void>;
    'play': () => Promise<void>;
    'ranges': Range[] | null;
    'setCurrentTime': (currentTime: number) => Promise<void>;
    'stop': () => Promise<void>;
  }
  interface TsVideoRemixer {}
}

declare global {


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

  interface HTMLTsVideoClipSelectorElement extends Components.TsVideoClipSelector, HTMLStencilElement {}
  var HTMLTsVideoClipSelectorElement: {
    prototype: HTMLTsVideoClipSelectorElement;
    new (): HTMLTsVideoClipSelectorElement;
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

  interface HTMLTsVideoOutputElement extends Components.TsVideoOutput, HTMLStencilElement {}
  var HTMLTsVideoOutputElement: {
    prototype: HTMLTsVideoOutputElement;
    new (): HTMLTsVideoOutputElement;
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
    'ts-play-button': HTMLTsPlayButtonElement;
    'ts-time': HTMLTsTimeElement;
    'ts-timeline': HTMLTsTimelineElement;
    'ts-video-clip-selector': HTMLTsVideoClipSelectorElement;
    'ts-video-controls': HTMLTsVideoControlsElement;
    'ts-video-list': HTMLTsVideoListElement;
    'ts-video-output': HTMLTsVideoOutputElement;
    'ts-video-player': HTMLTsVideoPlayerElement;
    'ts-video-remixer': HTMLTsVideoRemixerElement;
  }
}

declare namespace LocalJSX {
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
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'onScrub'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubEnd'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubStart'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'ranges'?: Range[];
    'selectionEnabled'?: boolean;
    'selectionHandleWidth'?: number;
  }
  interface TsVideoClipSelector {
    'onAddClip'?: (event: CustomEvent<Clip>) => void;
    'video'?: string;
  }
  interface TsVideoControls {
    'clipSelectionEnabled'?: boolean;
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'isPlaying'?: boolean;
    'onClipChanged'?: (event: CustomEvent<ClipChangeEventDetail>) => void;
    'onClipSelected'?: (event: CustomEvent<ClipChangeEventDetail>) => void;
    'onPause'?: (event: CustomEvent<any>) => void;
    'onPlay'?: (event: CustomEvent<any>) => void;
    'onScrub'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubEnd'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'onScrubStart'?: (event: CustomEvent<TimelineChangeEventDetail>) => void;
    'ranges'?: Range[];
  }
  interface TsVideoList {
    'onVideoSelected'?: (event: CustomEvent<string>) => void;
  }
  interface TsVideoOutput {
    'clips'?: Clip[];
    'onRemovedClip'?: (event: CustomEvent<Clip>) => void;
    'onReorderedClips'?: (event: CustomEvent<Clip[]>) => void;
    'onSave'?: (event: CustomEvent<string>) => void;
    'remixedVideo'?: string;
    'remixing'?: boolean;
  }
  interface TsVideoPlayer {
    'clipSelectionEnabled'?: boolean;
    'clips'?: Clip[];
    'onClipSelected'?: (event: CustomEvent<Clip>) => void;
    'ranges'?: Range[] | null;
  }
  interface TsVideoRemixer {}

  interface IntrinsicElements {
    'ts-play-button': TsPlayButton;
    'ts-time': TsTime;
    'ts-timeline': TsTimeline;
    'ts-video-clip-selector': TsVideoClipSelector;
    'ts-video-controls': TsVideoControls;
    'ts-video-list': TsVideoList;
    'ts-video-output': TsVideoOutput;
    'ts-video-player': TsVideoPlayer;
    'ts-video-remixer': TsVideoRemixer;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'ts-play-button': LocalJSX.TsPlayButton & JSXBase.HTMLAttributes<HTMLTsPlayButtonElement>;
      'ts-time': LocalJSX.TsTime & JSXBase.HTMLAttributes<HTMLTsTimeElement>;
      'ts-timeline': LocalJSX.TsTimeline & JSXBase.HTMLAttributes<HTMLTsTimelineElement>;
      'ts-video-clip-selector': LocalJSX.TsVideoClipSelector & JSXBase.HTMLAttributes<HTMLTsVideoClipSelectorElement>;
      'ts-video-controls': LocalJSX.TsVideoControls & JSXBase.HTMLAttributes<HTMLTsVideoControlsElement>;
      'ts-video-list': LocalJSX.TsVideoList & JSXBase.HTMLAttributes<HTMLTsVideoListElement>;
      'ts-video-output': LocalJSX.TsVideoOutput & JSXBase.HTMLAttributes<HTMLTsVideoOutputElement>;
      'ts-video-player': LocalJSX.TsVideoPlayer & JSXBase.HTMLAttributes<HTMLTsVideoPlayerElement>;
      'ts-video-remixer': LocalJSX.TsVideoRemixer & JSXBase.HTMLAttributes<HTMLTsVideoRemixerElement>;
    }
  }
}


