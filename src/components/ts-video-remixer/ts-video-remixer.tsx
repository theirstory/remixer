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

@Component({
  tag: "ts-video-remixer",
  styleUrl: "ts-video-remixer.css",
  shadow: true
})
export class TSRemixer {
  @Prop({ context: "store" }) store: Store;

  //#region actions
  appAddClip: Action;
  appRemoveClip: Action;
  appSetSelectedVideo: Action;
  appRemixClips: Action;
  //#endregion

  //#region state
  @State() clips: Clip[];
  @State() selectedVideo: string;
  @State() remixedVideo: string;
  //#endregion

  componentWillLoad() {
    // redux
    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: { clips, selectedVideo, remixedVideo }
      } = state;

      return {
        clips,
        selectedVideo,
        remixedVideo
      };
    });

    this.store.mapDispatchToProps(this, {
      appAddClip,
      appRemoveClip,
      appSetSelectedVideo,
      appRemixClips: appRemixClips
    });
  }

  render() {
    return (
      <div id="remixer">
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
      </div>
    );
  }

  @Listen("videoSelected")
  videoSelectedHandler(e: CustomEvent) {
    this.appSetSelectedVideo(urljoin(e.detail));
  }

  @Listen("addClip")
  addClipHandler(e: CustomEvent) {
    this.appAddClip(e.detail);
  }

  @Listen("remixClips")
  remixClipsHandler(e: CustomEvent) {
    this.appRemixClips(e.detail);
  }

  @Listen("removeClip")
  removeClipHandler(e: CustomEvent) {
    this.appRemoveClip(e.detail);
  }
}
