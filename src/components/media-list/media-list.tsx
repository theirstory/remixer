import "@ionic/core";
import { Component, h, State, Event, EventEmitter } from "@stencil/core";
import { trimExtension, getMediaList } from "../../utils";

@Component({
  tag: "ts-media-list",
  styleUrl: "media-list.css",
  shadow: false
})
export class MediaList {
  @State() media: string[] = [];
  @Event() mediaSelected: EventEmitter<string>;

  async componentWillLoad() {
    this.media = await getMediaList();
  }

  render() {
    return (
      <ion-list>
        {this.media.map((media: string) => {
          return (
            <ion-item>
              <ion-button
                size="small"
                onClick={() => {
                  this.mediaSelected.emit(media);
                }}
              >
                {trimExtension(media)}
              </ion-button>
            </ion-item>
          );
        })}
      </ion-list>
    );
  }
}
