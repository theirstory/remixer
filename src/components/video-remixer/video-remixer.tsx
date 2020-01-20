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
import { Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-video-remixer",
  styleUrl: "video-remixer.css",
  shadow: true
})
export class Remixer {
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
    return (
      <div id="remixer">
        <div class="col">
          <ts-video-list
            onVideoSelected={(e: CustomEvent<string>) => {
              this.appSetSelectedVideo(urljoin(e.detail));
            }}
          ></ts-video-list>
        </div>
        <div class="col">
          <ts-video-clip-selector
            video={this.selectedVideo}
            onAnnotate={(e: CustomEvent<Annotation>) => {
              console.log("annotate", e.detail);
            }}
            onEdit={(e: CustomEvent<Clip>) => {
              this.appAddClip(e.detail);
            }}
          ></ts-video-clip-selector>
        </div>
        <div class="col">
          <ts-video-output
            remixedVideo={this.remixedVideo}
            clips={this.clips}
            onRemovedClip={(e: CustomEvent<Clip>) => {
              this.appRemoveClip(e.detail);
            }}
            onReorderedClips={(e: CustomEvent<Clip[]>) => {
              this.appReorderClips(e.detail);
            }}
          ></ts-video-output>
        </div>
      </div>
    );
  }
}
