import "@ionic/core";
import { Component, h, State, Event, EventEmitter } from "@stencil/core";
import { trimExtension, getVideoList } from "../../utils";
import { VideoSelectedEventDetail } from "./interfaces";

@Component({
  tag: "ts-video-list",
  styleUrl: "video-list.css",
  shadow: false
})
export class TSVideoList {
  @State() videos: string[] = [];
  @Event() videoSelected: EventEmitter<VideoSelectedEventDetail>;

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
                  this.videoSelected.emit({
                    video: video
                  });
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
