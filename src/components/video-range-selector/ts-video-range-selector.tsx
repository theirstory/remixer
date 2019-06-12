import { Component, Prop, h, State, Event, EventEmitter } from "@stencil/core";
import { request, getFilename } from "../../utils";
import urljoin from "url-join";

@Component({
  tag: "ts-video-range-selector",
  styleUrl: "ts-video-range-selector.css",
  shadow: true
})
export class TSVideoRangeSelector {
  @State() max: number = 0;

  @Prop() endpoint: string;
  @Prop() video: string;

  @Event() add: EventEmitter;

  async componentWillUpdate() {
    const url: URL = new URL(urljoin(this.endpoint, this.video));
    const filename: string = getFilename(url);
    this.max = await request(urljoin(this.endpoint, "/duration/", filename));
  }

  render() {
    return (
      <div>
        <video src={this.endpoint + this.video} controls></video>
        <ion-range
          pin="true"
          dual-knobs="true"
          min="0"
          max={this.max}
          step="1"
          snaps="true"
          value={{ lower: 0, upper: this.max }}
        ></ion-range>
        <ion-button
          onClick={() => {
            this.add.emit({
              video: this.video
            });
          }}
        >
          Add
        </ion-button>
      </div>
    );
  }
}
