import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/clip";
import { getRemixedVideoUrl } from "../../utils";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: false
})
export class TSVideoOutput {

  @Prop() clips: Clip[] = [];
  @Prop() remixing: boolean;
  @Prop() remixedVideo: string;

  @Event() removeClip: EventEmitter;

  render() {
    return (
      <div>
        <ts-video-player clips={this.clips}></ts-video-player>
        <ion-list>
          {this.clips.map((clip: Clip) => {
            return (
              <ion-item>
                {clip.source} ({clip.start} - {clip.end})
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
