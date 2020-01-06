import "@ionic/core";
import { Component, h, State, Event, EventEmitter } from "@stencil/core";
import { trimExtension, getVideoList } from "../../utils";

@Component({
  tag: "ts-video-list",
  styleUrl: "ts-video-list.css",
  shadow: false
})
export class TSVideoList {
  @State() videos: string[] = [];
  @Event() videoSelected: EventEmitter;

  async componentWillLoad() {
    this.videos = await getVideoList();
  }

  render() {
    return (
      <ion-list>
        {this.videos.map((video: string) => {
          return (
            <ion-item>
              <ion-button
                size="small"
                onClick={() => {
                  this.videoSelected.emit(video);
                }}
              >
                {trimExtension(video)}
              </ion-button>
            </ion-item>
          );
        })}
      </ion-list>
    );
  }
}
