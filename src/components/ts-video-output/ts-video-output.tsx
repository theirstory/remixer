import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/clip";
import { getRemixedVideoUrl } from "../../utils";

@Component({
  tag: "ts-video-output",
  styleUrl: "ts-video-output.css",
  shadow: false
})
export class TSVideoOutput {

  @Prop() clips: Clip[] = [];
  @Prop() remixing: boolean;
  @Prop() remixedVideo: string;

  @Event() removeClip: EventEmitter;

  render() {
    return (
      <div>
        {
          (this.clips && this.clips.length) ? <ts-video-player clips={this.clips}></ts-video-player> : null
        }
        <ion-list>
          {this.clips.map((clip: Clip) => {
            return (
              <ion-item>
                {clip.source} ({clip.start} - {clip.end})
                <hr />
                <ion-button
                  size="small"
                  onClick={() => {
                    this.removeClip.emit(clip);
                  }}
                >
                  <ion-icon name="close"></ion-icon>
                </ion-button>
              </ion-item>
            );
          })}
        </ion-list>
        {
          this.clips.length ? (
            <ion-button
              size="small"
              disabled={
                !this.remixedVideo || this.remixing
              }
              onClick={() => {
                window.open(getRemixedVideoUrl(this.remixedVideo).href);
              }}
            >
              <ion-icon name="download"></ion-icon>
            </ion-button>
          ) : null
        }

      </div>
    );
  }
}
