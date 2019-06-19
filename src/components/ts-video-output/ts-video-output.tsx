import { Component, Prop, h, Event, EventEmitter, Watch } from "@stencil/core";
import { Clip } from "../../interfaces/clip";
import { getRemixedVideoUrl, sequenceClips } from "../../utils";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: false
})
export class TSVideoOutput {
  private _clips: Clip[] = [];

  @Prop() clips: Clip[] = [];
  @Watch("clips")
  async watchClips() {
    this._clips = sequenceClips(this.clips);
  }

  @Prop() remixing: boolean;
  @Prop() remixedVideo: string;

  @Event() removeClip: EventEmitter;

  render() {
    return (
      <div>
        <ts-video-player clips={this._clips}></ts-video-player>
        <ion-list>
          {this._clips.map((clip: Clip) => {
            return (
              <ion-item>
                id: {clip.id}
                <br />
                source: {clip.source}
                <br />
                sequenced start: {clip.sequencedStart}
                <br />
                sequenced end: {clip.sequencedEnd}
                <hr />
                <ion-button
                  size="small"
                  onClick={() => {
                    this.removeClip.emit(clip);
                  }}
                >
                  X
                </ion-button>
              </ion-item>
            );
          })}
        </ion-list>
        <ion-button
          size="small"
          disabled={
            !this.remixedVideo || this.remixing || this.clips.length === 0
          }
          onClick={() => {
            window.open(getRemixedVideoUrl(this.remixedVideo).href);
          }}
        >
          {this.remixing ? "Generating download file" : "Download"}
        </ion-button>
      </div>
    );
  }
}
