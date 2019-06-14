import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/clip";
import { getRemixedVideoUrl } from "../../utils";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: true
})
export class TSVideoOutput {
  @Prop() clips: Clip[] = [];
  @Prop() video: string;

  @Event() remixClips: EventEmitter;
  @Event() removeClip: EventEmitter;

  render() {
    return (
      <div>
        {this.video ? (
          <video src={getRemixedVideoUrl(this.video).href} controls></video>
        ) : null}
        <ion-list>
          {this.clips.map((clip: Clip) => {
            return (
              <ion-item>
                source: {clip.source}
                <br />
                start: {clip.start}
                <br />
                end: {clip.end}
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
          onClick={() => {
            this.remixClips.emit(this.clips);
          }}
        >
          Merge
        </ion-button>
      </div>
    );
  }
}
