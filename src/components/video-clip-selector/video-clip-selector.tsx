import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";
import { ClipSelectedEventDetail } from "./interfaces";

@Component({
  tag: "ts-video-clip-selector",
  styleUrl: "video-clip-selector.css",
  shadow: false
})
// The center column
export class TSVideoClipSelector {
  @Prop() video: string;

  @Event() addClip: EventEmitter<ClipSelectedEventDetail>;

  render() {
    if (this.video) {
      const clips: Clip[] = [
        {
          source: this.video
        }
      ];
      return (
        <div>
          <ts-video-player clips={clips} clip-selection-enabled="true" onClipSelected={(e: CustomEvent<ClipSelectedEventDetail>) => {
            const clip: Clip = e.detail.clip;

            this.addClip.emit({
              clip: {
                source: this.video,
                start: clip.start,
                end: clip.end
              }
            });
          }} />
        </div>
      );
    } else {
      return <div>Please select a video</div>;
    }
  }
}
