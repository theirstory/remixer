import { Component, Prop, h } from "@stencil/core";
import { Clip } from "../../interfaces/clip";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: true
})
export class TSVideoOutput {
  @Prop() clips: Clip[] = [];

  render() {
    return (
      <ion-list>
        {this.clips.map((clip: Clip) => {
          return (
            <ion-item>
              video: {clip.video}<br/>
              start: {clip.start}<br/>
              end: {clip.end}<hr/>
            </ion-item>
          );
        })}
      </ion-list>
    );
  }
}
