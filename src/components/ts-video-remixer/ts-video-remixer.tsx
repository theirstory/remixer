import { Component, Prop, h, Listen, State } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import { appSetSelectedVideo } from "../../redux/actions";
import { configureStore } from "../../redux/store";
import urljoin from "url-join";

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
  appSetSelectedVideo: Action;
  //#endregion

  //#region state
  @State() selectedVideo: string;
  //#endregion

  componentWillLoad() {
    // redux
    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: { selectedVideo }
      } = state;

      return {
        selectedVideo
      };
    });

    this.store.mapDispatchToProps(this, {
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
            endpoint={this.endpoint}
            video={this.selectedVideo}
          ></ts-video-range-selector>
        </div>
        <div class="col">
          <ts-video-output></ts-video-output>
        </div>
      </div>
    );
  }

  @Listen("videoSelected")
  videoSelectedHandler(event: CustomEvent) {
    this.appSetSelectedVideo(urljoin(this.videosPath, event.detail));
  }
}
