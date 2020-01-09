import { Component, Prop, h, Event, EventEmitter, Listen } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";

@Component({
  tag: "ts-video-clip-selector",
  styleUrl: "video-clip-selector.css",
  shadow: false
})
export class TSVideoClipSelector {
  @Prop() video: string;

  @Event() addClip: EventEmitter;

  render() {
    if (this.video) {
      const clips: Clip[] = [
        {
          source: this.video
        }
      ];
      return (
        <div>
          <ts-video-player clips={clips} clip-selection-enabled="true" />
        </div>
      );
    } else {
      return <div>Please select a video</div>;
    }
  }

  @Listen("clipSelected")
  onClipSelected(e: CustomEvent) {
    //console.log("clip selected", e.detail);
    const clip: Clip = e.detail;

    this.addClip.emit({
      source: this.video,
      start: clip.start,
      end: clip.end
    } as Clip);
  }
}
