import { Component, Prop, h, Event, EventEmitter, State, Watch } from "@stencil/core";
import { Annotation, AnnotationMap, Motivation } from "../../interfaces/Annotation";
import AddAnnotationIcon from "../../assets/svg/add-annotation.svg";
import { getNextAnnotationId } from "../../utils";

@Component({
  tag: "ts-cutting-room",
  styleUrl: "cutting-room.css",
  shadow: false
})
// The center column
export class CuttingRoom {
  @State() clip: Annotation | null = null;

  @Prop() media: string;
  @Watch("media")
  async watchMedia() {
    this._clips = null;
    this.clip = null;
  }

  @Event() edit: EventEmitter<Annotation>;

  private _clips: AnnotationMap | null;
  //private _mediaPlayer: HTMLTsMediaPlayerElement;

  // create a dummy annotation
  // this isn't entered into the redux store, and is only used to view a single piece of media
  private get clips(): AnnotationMap {

    if (this._clips) {
      // cache annotations so that sequencing isn't triggered on rerender
      return this._clips;
    }

    this._clips = new Map<string, Annotation>();

    return this._clips.set(getNextAnnotationId(),
      {
        start: 0,
        body: this.media,
        motivation: Motivation.EDITING
      });
  }

  render() {
    if (this.media) {
      return (
        <div>
          <ts-media-player
            annotationMotivation={Motivation.EDITING}
            movePlayheadOnSelect={false}
            selected={this.clip}
            annotation-enabled={true}
            clips={this.clips}
            onAnnotation={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              this.clip = e.detail;
            }}
          />
          {this.clip && this.clip.start !== this.clip.end && (
            <ion-button
              size="small"
              onClick={() => {
                this.edit.emit(this.clip);
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
