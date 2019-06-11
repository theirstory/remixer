import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "ts-video-remixer",
  styleUrl: "ts-video-remixer.css",
  shadow: true
})
export class TSRemixer {
  @Prop() endpoint: string;

  render() {
    return (
      <div id="remixer">
        <div class="col">
          <ts-video-list endpoint={this.endpoint}></ts-video-list>
        </div>
        <div class="col">
          <ts-video-range-selector></ts-video-range-selector>
        </div>
        <div class="col">
          <ts-video-output></ts-video-output>
        </div>
      </div>
    );
  }
}
