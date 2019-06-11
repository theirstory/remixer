import { Component, Prop, h, Listen } from "@stencil/core";

@Component({
  tag: "ts-video-remixer",
  styleUrl: "ts-video-remixer.css",
  shadow: true
})
export class TSRemixer {
  private _videoRangeSelector: HTMLTsVideoRangeSelectorElement;

  @Prop() endpoint: string;

  render() {
    return (
      <div id="remixer">
        <div class="col">
          <ts-video-list endpoint={this.endpoint}></ts-video-list>
        </div>
        <div class="col">
          <ts-video-range-selector
            ref={(el: HTMLTsVideoRangeSelectorElement) =>
              (this._videoRangeSelector = el)
            }
            endpoint={this.endpoint}
          ></ts-video-range-selector>
        </div>
        <div class="col">
          <ts-video-output></ts-video-output>
        </div>
      </div>
    );
  }

  @Listen("videoSelected")
  videoSelectedHandler(event: CustomEvent) {
    this._videoRangeSelector.video = this.endpoint + "/videos/" + event.detail;
    //console.log('Received the custom todoCompleted event: ', event.detail);
  }
}
