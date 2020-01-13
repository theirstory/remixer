import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter, State } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";
import { getRemixedVideoUrl, sequenceClips } from "../../utils";
import { ItemReorderEventDetail } from "@ionic/core";
import { Range, RangeType } from "../timeline/interfaces";

@Component({
  tag: "ts-video-output",
  styleUrl: "video-output.css",
  shadow: false
})
export class TSVideoOutput {
  @Prop({ mutable: true }) clips: Clip[] = [];
  @Prop() remixing: boolean;
  @Prop() remixedVideo: string;

  @Event() reorderedClips: EventEmitter<Clip[]>;
  @Event() removedClip: EventEmitter<Clip>;
  @Event() save: EventEmitter<string>;

  private _videoPlayer: HTMLTsVideoPlayerElement;
  @State() private _highlightedClip: Clip | null = null;

  private _reorderClips(event: CustomEvent<ItemReorderEventDetail>) {
    const indexes: ItemReorderEventDetail = event.detail;

    const newClips: Clip[] = [...this.clips];

    let element = this.clips[indexes.from];
    newClips.splice(indexes.from, 1);
    newClips.splice(indexes.to, 0, element);

    event.detail.complete(this.clips);
    this.clips = newClips;
    this.reorderedClips.emit(this.clips);
  }

  get sequencedClips(): Clip[] {
    return sequenceClips(this.clips);
  }

  render() {
    return (
      <div>
        {(this.clips.length > 0) && (
          <ts-video-player
          ref={el => this._videoPlayer = el}
          clips={this.clips}
          ranges={
            this._highlightedClip ? [{
              id: this._highlightedClip.id,
              start: this._highlightedClip.sequencedStart,
              end: this._highlightedClip.sequencedEnd,
              type: RangeType.HIGHLIGHT
            } as Range] : null}></ts-video-player>
        )}
        <ion-reorder-group disabled={false} onIonItemReorder={e => this._reorderClips(e)}>
          {this.sequencedClips.map((clip: Clip) => {
            return (
              <ion-item onMouseOver={
                (_e: MouseEvent) => {
                  this._highlightedClip = this.sequencedClips.find(c => {
                    return c.id === clip.id
                  })
                }}
                onMouseOut={
                  (_e: MouseEvent) => {
                    this._highlightedClip = null
                  }
                }>
                <ion-label>{clip.source}</ion-label>
                <ion-button
                  size="small"
                  onClick={() => {
                    this._videoPlayer.setCurrentTime(clip.sequencedStart);
                  }}
                >
                  <ion-icon name="fastforward"></ion-icon>
                </ion-button>
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
        {/* <br/><br/>
        {this.sequencedClips.map((clip: Clip) => {
            return (
              <ion-item>
                <ion-label>{clip.source}</ion-label>
              </ion-item>
            );
          })} */}
        {(this.sequencedClips.length > 0) && (
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
