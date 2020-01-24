import { Component, Prop, h, Event, EventEmitter, State, Watch } from "@stencil/core";
import { Annotation, AnnotationMap } from "../../interfaces/Annotation";
import AddAnnotationIcon from "../../assets/svg/add-annotation.svg";
import { getNextAnnotationId } from "../../utils";

@Component({
  tag: "ts-cutting-room",
  styleUrl: "cutting-room.css",
  shadow: false
})
// The center column
export class CuttingRoom {
  @State() annotation: Annotation | null = null;

  @Prop() media: string;
  @Watch("media")
  async watchMedia() {
    this._annotations = undefined;
    this.annotation = null;
  }

  @Event() edit: EventEmitter<Annotation>;

  private _annotations: AnnotationMap;

  // create a dummy annotation
  // this isn't entered into the redux store, and is only used to view a single piece of media
  private get annotations(): AnnotationMap {

    if (this._annotations) {
      // cache annotations so that sequencing isn't triggered on rerender
      return this._annotations;
    }

    this._annotations = new Map<string, Annotation>();

    return this._annotations.set(getNextAnnotationId(),
      {
        start: 0,
        target: this.media
      });
  }

  render() {
    if (this.media) {
      return (
        <div>
          <ts-media-player
            annotation-enabled={true}
            annotations={this.annotations}
            onAnnotation={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              this.annotation = e.detail;
            }}
          />
          {this.annotation && this.annotation.start !== this.annotation.end && (
            <ion-button
              size="small"
              onClick={() => {
                this.edit.emit(this.annotation);
              }}
            >
              <ion-icon src={AddAnnotationIcon}></ion-icon>
            </ion-button>
          )}
        </div>
      );
    } else {
      return <div>Please select media from the list to remix</div>;
    }
  }
}
