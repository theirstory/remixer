import { Component, Prop, h, Event, EventEmitter, State } from "@stencil/core";
import { Annotation } from "../../interfaces/Annotation";
import AddClipIcon from "../../assets/svg/add-clip.svg";
import { getNextClipId } from "../../utils";

@Component({
  tag: "ts-cutting-room",
  styleUrl: "cutting-room.css",
  shadow: false
})
// The center column
export class CuttingRoom {

  @State() annotation: Annotation;

  @Prop() video: string;

  @Event() edit: EventEmitter<Annotation>;

  private _clips: Annotation[];

  private get clips(): Annotation[] {
    if (this._clips) {
      // cache clips so that sequencing isn't triggered on rerender
      return this._clips;
    }
    return this._clips = [
      {
        target: this.video
      }
    ]
  };

  render() {
    if (this.video) {
      return (
        <div>
          <ts-video-player
            annotation-enabled={true}
            clips={this.clips}
            onAnnotation={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              this.annotation = e.detail;
            }}
          />
          {
            this.annotation && this.annotation.start !== this.annotation.end && (
              <ion-button
                size="small"
                onClick={() => {
                  this.edit.emit({
                    id: getNextClipId(),
                    ...this.annotation
                  });
                }}
              >
                <ion-icon src={AddClipIcon}></ion-icon>
              </ion-button>
            )
          }
        </div>
      );
    } else {
      return <div>Please select a video</div>;
    }
  }
}
