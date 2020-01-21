import { Component, Prop, h, Event, EventEmitter, State } from "@stencil/core";
import { Annotation } from "../../interfaces/Annotation";
import AddClipIcon from "../../assets/svg/add-clip.svg";
import { Clip } from "../../interfaces/Clip";

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

  private _clips: Clip[];

  private get clips(): Clip[] {
    if (this._clips) {
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
              this.annotation = {
                ...e.detail,
                target: this.video
              };
            }}
          />
          {
            this.annotation && (
              <ion-button
                size="small"
                onClick={() => {
                  this.edit.emit(this.annotation);
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
