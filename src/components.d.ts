/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface TsVideoList {
    'endpoint': string;
  }
  interface TsVideoOutput {
    'video': string;
  }
  interface TsVideoRangeSelector {
    'endpoint': string;
    'video': string;
  }
  interface TsVideoRemixer {
    'endpoint': string;
  }
}

declare global {


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

  interface HTMLTsVideoRangeSelectorElement extends Components.TsVideoRangeSelector, HTMLStencilElement {}
  var HTMLTsVideoRangeSelectorElement: {
    prototype: HTMLTsVideoRangeSelectorElement;
    new (): HTMLTsVideoRangeSelectorElement;
  };

  interface HTMLTsVideoRemixerElement extends Components.TsVideoRemixer, HTMLStencilElement {}
  var HTMLTsVideoRemixerElement: {
    prototype: HTMLTsVideoRemixerElement;
    new (): HTMLTsVideoRemixerElement;
  };
  interface HTMLElementTagNameMap {
    'ts-video-list': HTMLTsVideoListElement;
    'ts-video-output': HTMLTsVideoOutputElement;
    'ts-video-range-selector': HTMLTsVideoRangeSelectorElement;
    'ts-video-remixer': HTMLTsVideoRemixerElement;
  }
}

declare namespace LocalJSX {
  interface TsVideoList extends JSXBase.HTMLAttributes<HTMLTsVideoListElement> {
    'endpoint'?: string;
    'onVideoSelected'?: (event: CustomEvent<any>) => void;
  }
  interface TsVideoOutput extends JSXBase.HTMLAttributes<HTMLTsVideoOutputElement> {
    'video'?: string;
  }
  interface TsVideoRangeSelector extends JSXBase.HTMLAttributes<HTMLTsVideoRangeSelectorElement> {
    'endpoint'?: string;
    'onAdd'?: (event: CustomEvent<any>) => void;
    'video'?: string;
  }
  interface TsVideoRemixer extends JSXBase.HTMLAttributes<HTMLTsVideoRemixerElement> {
    'endpoint'?: string;
  }

  interface IntrinsicElements {
    'ts-video-list': TsVideoList;
    'ts-video-output': TsVideoOutput;
    'ts-video-range-selector': TsVideoRangeSelector;
    'ts-video-remixer': TsVideoRemixer;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


