import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";

@Component({
  tag: "ts-video-clip-selector",
  styleUrl: "video-clip-selector.css",
  shadow: false
})
// The center column
export class TSVideoClipSelector {
  @Prop() video: string;

  @Event() addClip: EventEmitter<Clip>;

  render() {
    if (this.video) {
      const clips: Clip[] = [
        {
          source: this.video
        }
      ];
      return (
        <div>
          <ts-video-player clips={clips} clip-selection-enabled="true" onClipSelected={(e: CustomEvent<Clip>) => {
            const clip: Clip = e.detail;

            this.addClip.emit({
              source: this.video,
              start: clip.start,
              end: clip.end
            });
          }} />
        </div>
      );
    } else {
      return <div>Please select a video</div>;
    }
  }
}
