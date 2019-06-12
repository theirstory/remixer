import { Component, Prop, h, Listen, State } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import { appSetSelectedVideo, appAddClip, appRemoveClip } from "../../redux/actions";
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
  @Prop() videosPath: string;
  @Prop() endpoint: string;

  //#region actions
  appAddClip: Action;
  appRemoveClip: Action;
  appSetSelectedVideo: Action;
  //#endregion

  //#region state
  @State() clips: Clip[];
  @State() selectedVideo: string;
  //#endregion

  componentWillLoad() {
    // redux
    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: {
          clips,
          selectedVideo
        }
      } = state;

      return {
        clips,
        selectedVideo
      };
    });

    this.store.mapDispatchToProps(this, {
      appAddClip,
      appRemoveClip,
      appSetSelectedVideo
    });
  }

  render() {
    return (
      <div id="remixer">
        <div class="col">
          <ts-video-list endpoint={this.endpoint}></ts-video-list>
        </div>
        <div class="col">
          <ts-video-range-selector
            videosPath={this.videosPath}
            endpoint={this.endpoint}
            video={this.selectedVideo}
          ></ts-video-range-selector>
        </div>
        <div class="col">
          <ts-video-output clips={this.clips}></ts-video-output>
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
}
