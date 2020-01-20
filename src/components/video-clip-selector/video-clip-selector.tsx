import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-video-clip-selector",
  styleUrl: "video-clip-selector.css",
  shadow: false
})
// The center column
export class VideoClipSelector {
  @Prop() video: string;

  @Event() annotate: EventEmitter<Annotation>;
  @Event() edit: EventEmitter<Annotation>;

  render() {
    if (this.video) {
      return (
        <div>
          <ts-video-player
            annotation-enabled={false}
            editing-enabled={true}
            clips={[
              {
                target: this.video
              }
            ]}
            onAnnotate={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              this.annotate.emit({
                ...e.detail,
                target: this.video
              });
            }}
            onEdit={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              this.edit.emit({
                ...e.detail,
                target: this.video
              });
            }}
          />
        </div>
      );
    } else {
      return <div>Please select a video</div>;
    }
  }
}
