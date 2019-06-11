import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: true
})
export class TSVideoOutput {
  @Prop() video: string;

  render() {
    return <div>output</div>;
  }
}
