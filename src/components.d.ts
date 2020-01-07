/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Clip,
} from './interfaces/Clip';

export namespace Components {
  interface TsVideoClipSelector {
    'video': string;
  }
  interface TsVideoControls {
    'clipSelectionEnabled': boolean;
    'currentTime': number;
    'disabled': boolean;
    'duration': number;
    'isPlaying': boolean;
    'pin': boolean;
    'step': number;
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
  }
  interface TsVideoRemixer {}
}

declare global {


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
    'ts-video-clip-selector': HTMLTsVideoClipSelectorElement;
    'ts-video-controls': HTMLTsVideoControlsElement;
    'ts-video-list': HTMLTsVideoListElement;
    'ts-video-output': HTMLTsVideoOutputElement;
    'ts-video-player': HTMLTsVideoPlayerElement;
    'ts-video-remixer': HTMLTsVideoRemixerElement;
  }
}

declare namespace LocalJSX {
  interface TsVideoClipSelector {
    'onAddClip'?: (event: CustomEvent<any>) => void;
    'video'?: string;
  }
  interface TsVideoControls {
    'clipSelectionEnabled'?: boolean;
    'currentTime'?: number;
    'disabled'?: boolean;
    'duration'?: number;
    'isPlaying'?: boolean;
    'onClipChanged'?: (event: CustomEvent<any>) => void;
    'onClipSelected'?: (event: CustomEvent<any>) => void;
    'onPause'?: (event: CustomEvent<any>) => void;
    'onPlay'?: (event: CustomEvent<any>) => void;
    'onScrub'?: (event: CustomEvent<any>) => void;
    'onScrubEnd'?: (event: CustomEvent<any>) => void;
    'onScrubStart'?: (event: CustomEvent<any>) => void;
    'pin'?: boolean;
    'step'?: number;
  }
  interface TsVideoList {
    'onVideoSelected'?: (event: CustomEvent<any>) => void;
  }
  interface TsVideoOutput {
    'clips'?: Clip[];
    'onRemovedClip'?: (event: CustomEvent<any>) => void;
    'onReorderedClips'?: (event: CustomEvent<any>) => void;
    'onSave'?: (event: CustomEvent<any>) => void;
    'remixedVideo'?: string;
    'remixing'?: boolean;
  }
  interface TsVideoPlayer {
    'clipSelectionEnabled'?: boolean;
    'clips'?: Clip[];
  }
  interface TsVideoRemixer {}

  interface IntrinsicElements {
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
      'ts-video-clip-selector': LocalJSX.TsVideoClipSelector & JSXBase.HTMLAttributes<HTMLTsVideoClipSelectorElement>;
      'ts-video-controls': LocalJSX.TsVideoControls & JSXBase.HTMLAttributes<HTMLTsVideoControlsElement>;
      'ts-video-list': LocalJSX.TsVideoList & JSXBase.HTMLAttributes<HTMLTsVideoListElement>;
      'ts-video-output': LocalJSX.TsVideoOutput & JSXBase.HTMLAttributes<HTMLTsVideoOutputElement>;
      'ts-video-player': LocalJSX.TsVideoPlayer & JSXBase.HTMLAttributes<HTMLTsVideoPlayerElement>;
      'ts-video-remixer': LocalJSX.TsVideoRemixer & JSXBase.HTMLAttributes<HTMLTsVideoRemixerElement>;
    }
  }
}


