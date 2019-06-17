import { Component, Prop, h, Listen, State } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import {
  appSetSelectedVideo,
  appAddClip,
  appRemoveClip,
  appRemixClips
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import urljoin from "url-join";
import { Clip } from "../../interfaces/clip";
import { getNextClipId } from "../../utils";
import classNames from "classnames";

@Component({
  tag: "ts-video-remixer",
  styleUrl: "ts-video-remixer.css",
  shadow: true
})
export class TSRemixer {
  @Prop({ context: "store" }) store: Store;

  //#region actions
  appAddClip: Action;
  appRemixClips: Action;
  appRemoveClip: Action;
  appSetSelectedVideo: Action;
  //#endregion

  //#region state
  @State() clips: Clip[];
  @State() remixedVideo: string;
  @State() remixing: boolean;
  @State() selectedVideo: string;
  //#endregion

  componentWillLoad() {
    // redux
    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: { clips, remixedVideo, remixing, selectedVideo }
      } = state;

      return {
        clips,
        remixedVideo,
        remixing,
        selectedVideo
      };
    });

    this.store.mapDispatchToProps(this, {
      appAddClip,
      appRemoveClip,
      appSetSelectedVideo,
      appRemixClips
    });
  }

  render() {
    const containerClasses = classNames({
      remixing: this.remixing
    });

    return (
      <div id="remixer" class={containerClasses}>
        <div class="col">
          <ts-video-list></ts-video-list>
        </div>
        <div class="col">
          <ts-video-range-selector
            video={this.selectedVideo}
          ></ts-video-range-selector>
        </div>
        <div class="col">
          <ts-video-output
            video={this.remixedVideo}
            clips={this.clips}
          ></ts-video-output>
        </div>
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    );
  }

  @Listen("videoSelected")
  videoSelectedHandler(e: CustomEvent) {
    this.appSetSelectedVideo(urljoin(e.detail));
  }

  @Listen("addClip")
  addClipHandler(e: CustomEvent) {
    const clip: Clip = e.detail;
    clip.id = getNextClipId(this.clips);
    this.appAddClip(e.detail);
    this.appRemixClips(this.clips);
  }

  @Listen("removeClip")
  removeClipHandler(e: CustomEvent) {
    this.appRemoveClip(e.detail);
    this.appRemixClips(this.clips);
  }
}
