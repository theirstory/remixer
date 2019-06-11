import { Component, Prop, h, State } from "@stencil/core";
import { request, getFilename } from "../../utils";

@Component({
  tag: "ts-video-range-selector",
  styleUrl: "ts-video-range-selector.css",
  shadow: true
})
export class TSVideoRangeSelector {

  @State() max: number = 0;

  @Prop() endpoint: string;
  @Prop() video: string;

  async componentDidUpdate() {
    const url: URL = new URL(this.video);
    const filename: string = getFilename(url);
    this.max = await request(this.endpoint + "/duration/" + filename);
  }

  render() {
    return (
      <div>
        <video src={this.video} controls></video>
        <ion-range dual-knobs="true" min="0" max={this.max} step="1" snaps="true"></ion-range>
      </div>
    );
  }
}
