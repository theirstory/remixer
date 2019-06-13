import {
  Component,
  Prop,
  h,
  Event,
  EventEmitter,
  Watch,
  State
} from "@stencil/core";
import { getVideoUrl, getVideoDuration } from "../../utils";
import { Clip } from "../../interfaces/Clip";

@Component({
  tag: "ts-video-range-selector",
  styleUrl: "ts-video-range-selector.css",
  shadow: true
})
export class TSVideoRangeSelector {
  @State() duration: number = 0;

  @Prop() video: string;
  @Watch("video")
  async watchVideo() {
    const url: URL = getVideoUrl(this.video);
    this.duration = await getVideoDuration(url);
    this.min = 0;
    this.max = this.duration;
  }

  @Prop({ mutable: true }) max: number = 0;
  @Prop({ mutable: true }) min: number = 0;

  @Event() addClip: EventEmitter;

  private _rangeChanged(e: any): void {
    this.min = e.lower;
    this.max = e.upper;
  }

  render() {
    if (this.video) {
      return (
        <div>
          <video src={getVideoUrl(this.video).href} controls></video>
          <ion-range
            pin="true"
            dual-knobs="true"
            min="0"
            max={this.duration}
            value={{ lower: this.min, upper: this.max }}
            onIonChange={e => this._rangeChanged(e.detail.value)}
          ></ion-range>
          <ion-button
            onClick={() => {
              this.addClip.emit({
                video: this.video,
                start: this.min,
                end: this.max
              } as Clip);
            }}
          >
            Add
          </ion-button>
        </div>
      );
    } else {
      return <div>Please select a video</div>;
    }
  }
}
