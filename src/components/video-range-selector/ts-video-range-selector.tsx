import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "ts-video-range-selector",
  styleUrl: "ts-video-range-selector.css",
  shadow: true
})
export class TSVideoRangeSelector {
  @Prop() video: string;

  render() {
    return <div>range selector</div>;
  }
}
