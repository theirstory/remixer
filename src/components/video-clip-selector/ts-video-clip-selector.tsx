import {
  Component,
  Prop,
  h,
  Event,
  EventEmitter,
  Listen
} from "@stencil/core";
import { Clip } from "../../interfaces/clip";

@Component({
  tag: "ts-video-clip-selector",
  styleUrl: "ts-video-clip-selector.css",
  shadow: false
})
export class TSVideoClipSelector {

  @Prop() video: string;

  @Event() addClip: EventEmitter;

  render() {
    console.log("video", this.video);
    if (this.video) {
      const clips: Clip[] = [
        {
          source: this.video
        }
      ];
      console.log(clips);
      return (
        <div>
          <ts-video-player
            clips={clips}
            clip-selection-enabled="true" />
        </div>
      );
    } else {
      return <div>Please select a video</div>;
    }
  }

  @Listen("clipChanged")
  onClipChanged(e: CustomEvent) {
    //this._rangeStart = e.detail;
    console.log("clip changed", e.detail);
  }

  @Listen("clipSelected")
  onClipSelected(e: CustomEvent) {
    //this._rangeEnd = e.detail;
    console.log("clip selected", e.detail);
  }
}
