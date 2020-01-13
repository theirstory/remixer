import { Component, Prop, h, State } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import {
  appSetSelectedVideo,
  appAddClip,
  appRemoveClip,
  appReorderClips
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import urljoin from "url-join";
import { Clip } from "../../interfaces/Clip";
import classNames from "classnames";
import { ClipSelectedEventDetail } from "../video-clip-selector/interfaces";
import { VideoSelectedEventDetail } from "../video-list/interfaces";
import { RemovedClipEventDetail, ReorderedClipsEventDetail } from "../video-output/interfaces";

@Component({
  tag: "ts-video-remixer",
  styleUrl: "video-remixer.css",
  shadow: true
})
export class TSRemixer {
  @Prop({ context: "store" }) store: Store;

  //#region actions
  appAddClip: Action;
  appRemixClips: Action;
  appRemoveClip: Action;
  appReorderClips: Action;
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
      appReorderClips
    });
  }

  render() {
    // adding the working class to the container will disable all buttons
    // and show a spinner
    const containerClasses = classNames({
      working: false
    });

    return (
      <div id="remixer" class={containerClasses}>
        <div class="col">
          <ts-video-list onVideoSelected={
            (e: CustomEvent<VideoSelectedEventDetail>) => {
              this.appSetSelectedVideo(urljoin(e.detail.video));
            }
          }></ts-video-list>
        </div>
        <div class="col">
          <ts-video-clip-selector
            video={this.selectedVideo}
            onAddClip={
              (e: CustomEvent<ClipSelectedEventDetail>) => {
                const clip: Clip = e.detail.clip;
                this.appAddClip(clip);
              }}
          ></ts-video-clip-selector>
        </div>
        <div class="col">
          <ts-video-output
            remixedVideo={this.remixedVideo}
            clips={this.clips}
            onRemovedClip={
              (e: CustomEvent<RemovedClipEventDetail>) => {
                this.appRemoveClip(e.detail.clip);
              }
            }
            onReorderedClips={
              (e: CustomEvent<ReorderedClipsEventDetail>) => {
                this.appReorderClips(e.detail.clips);
              }
            }
          ></ts-video-output>
        </div>
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}
