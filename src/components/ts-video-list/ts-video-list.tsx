import { Component, Prop, h, State, Event, EventEmitter } from "@stencil/core";
import { request, trimExtension } from "../../utils";

@Component({
  tag: "ts-video-list",
  styleUrl: "ts-video-list.css",
  shadow: true
})
export class TSVideoList {
  @Prop() endpoint: string;
  @State() videos: string[] = [];
  @Event() videoSelected: EventEmitter;

  async componentWillLoad() {
    this.videos = await request(this.endpoint + "/list");
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
