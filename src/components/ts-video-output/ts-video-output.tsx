import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";
import { getRemixedVideoUrl } from "../../utils";
import { ItemReorderEventDetail } from "@ionic/core";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: false
})
export class TSVideoOutput {
  @Prop({ mutable: true }) clips: Clip[] = [];
  @Prop() remixing: boolean;
  @Prop() remixedVideo: string;

  @Event() reorderedClips: EventEmitter;
  @Event() removedClip: EventEmitter;
  @Event() save: EventEmitter;

  private _reorderClips(event: CustomEvent<ItemReorderEventDetail>) {
    const indexes: ItemReorderEventDetail = event.detail;

    const newClips: Clip[] = [...this.clips];

    let element = this.clips[indexes.from];
    newClips.splice(indexes.from, 1);
    newClips.splice(indexes.to, 0, element);

    event.detail.complete();
    this.clips = newClips;
    this.reorderedClips.emit(this.clips);
  }

  render() {
    return (
      <div>
        {(this.clips.length > 0) && (
          <ts-video-player clips={this.clips}></ts-video-player>
        )}
        <ion-reorder-group disabled={false} onIonItemReorder={e => this._reorderClips(e)}>
          {this.clips.map((clip: Clip) => {
            return (
              <ion-item>
                <ion-label>{clip.source} ({clip.start} - {clip.end})</ion-label>
                <ion-button
                  size="small"
                  onClick={() => {
                    this.removedClip.emit(clip);
                  }}
                >
                  <ion-icon name="close"></ion-icon>
                </ion-button>
                <ion-reorder slot="end"></ion-reorder>
              </ion-item>
            );
          })}
        </ion-reorder-group >
        {(this.clips.length > 0) && (
          <div>
            <ion-button
              size="small"
              disabled={!this.remixedVideo || this.remixing}
              onClick={() => {
                window.open(getRemixedVideoUrl(this.remixedVideo).href);
              }}
            >
              <ion-icon name="download"></ion-icon>
            </ion-button>
            <ion-button
              size="small"
              disabled={!this.remixedVideo || this.remixing}
              onClick={() => {
                this.save.emit(JSON.stringify(this.clips));
              }}
            >
              <ion-icon name="save"></ion-icon>
            </ion-button>
          </div>
        )}
      </div>
    );
  }
}
