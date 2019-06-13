import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/clip";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: true
})
export class TSVideoOutput {
  @Prop() clips: Clip[] = [];

  @Event() mergeClips: EventEmitter;

  render() {
    return (
      <div>
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
              </ion-item>
            );
          })}
        </ion-list>
        <ion-button
          onClick={() => {
            this.mergeClips.emit(this.clips);
          }}
        >
          Merge
        </ion-button>
      </div>
    );
  }
}
