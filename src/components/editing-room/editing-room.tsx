import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter, State, Watch } from "@stencil/core";
import { getRemixedMediaUrl, sequenceClips, round, getNextAnnotationId, filterAnnotationsByMotivation, retargetClip } from "../../utils";
import { Motivation, AnnotationMap, AnnotationTuple, Annotation } from "../../interfaces/Annotation";
import { SequencedDuration } from "../../interfaces/SequencedDuration";

@Component({
  tag: "ts-editing-room",
  styleUrl: "editing-room.css",
  shadow: false
})
export class EditingRoom {

  private _clips: AnnotationMap | null = null;

  @Prop() annotations: AnnotationMap;
  @Watch("annotations")
  protected annotationsChanged() {
    // clear cache
    this._clips = null;
  }

  private _selectedAnnotation: Annotation | null = null;

  @Prop() selectedAnnotation: AnnotationTuple | null;
  @Watch("selectedAnnotation")
  protected selectedAnnotationChanged() {
    //clear cache
    this._selectedAnnotation = null;
  }

  @Prop() annotationMotivation: Motivation;
  @Prop() remixedMedia: string;
  @Prop() remixing: boolean;

  @Event() setAnnotation: EventEmitter<AnnotationTuple>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;
  @Event() deleteAnnotation: EventEmitter<string>;
  @Event() selectAnnotation: EventEmitter<string>;
  @Event() selectAnnotationMotivation: EventEmitter<Motivation>;
  @Event() save: EventEmitter<string>;

  @State() private _highlightedAnnotation: AnnotationTuple | null = null;

  private get _sequencedAnnotations(): AnnotationMap {
    return sequenceClips(this.annotations);
  }

  private get highlights(): AnnotationMap {

    const highlights: AnnotationMap = new Map<string, Annotation>();

    if (this._highlightedAnnotation) {
      highlights.set(this._highlightedAnnotation[0], {
        ...this._sequencedAnnotations.get(this._highlightedAnnotation[0]),
        motivation: Motivation.HIGHLIGHTING
      });
    }

    return highlights;
  }

  private get clipsCached() {

    if (this._clips) {
      return this._clips;
    }

    return this._clips = filterAnnotationsByMotivation(this.annotations, Motivation.EDITING);
  }

  private get selectedAnnotationCached(): Annotation {

    if (this._selectedAnnotation) {
      return this._selectedAnnotation;
    }

    return this._selectedAnnotation = this.selectedAnnotation ? this._sequencedAnnotations.get(this.selectedAnnotation[0]) : null;
  }

  render() {
    return (
      <div>
        {this.annotations.size > 0 && (
          <ts-media-player
            annotationEnabled={true}
            annotationMotivation={this.annotationMotivation}
            movePlayheadOnSelect={true}
            selected={this.selectedAnnotationCached}
            clips={this.clipsCached}
            highlights={this.highlights}
            onAnnotation={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();

              const selection: Annotation = e.detail;

              // if an annotation is selected
              if (this.selectedAnnotation) {
                // if the selection has no duration, delete it if it's not a bookmark
                if ((round(selection.start) === round(selection.end)) && this.selectedAnnotationCached.motivation !== Motivation.BOOKMARKING) {
                  this.deleteAnnotation.emit(this.selectedAnnotation[0]);
                } else {
                  const motivation: Motivation = this.selectedAnnotation[1].motivation;

                  if (motivation === Motivation.EDITING) {

                    // retarget global timeline time to local clip time
                    const duration: SequencedDuration = retargetClip(selection, this.selectedAnnotationCached);

                    this.setAnnotation.emit([
                      this.selectedAnnotation[0], {
                        motivation: selection.motivation ? selection.motivation : this.annotationMotivation,
                        start: duration.start,
                        end: duration.end,
                        body: selection.body
                      }
                    ]);
                  } else {
                    this.setAnnotation.emit([
                      this.selectedAnnotation[0], {
                        ...this.selectedAnnotation[1],
                        ...selection
                      }
                    ]);
                  }
                }
              } else {
                // an annotation isn't already selected, create a new one
                // except if it's an edit, these can only be created in the cutting room
                if (this.annotationMotivation !== Motivation.EDITING) {
                  const labels = {
                    [Motivation.BOOKMARKING]: "new bookmark",
                    [Motivation.COMMENTING]: "new comment"
                  }
                  this.setAnnotation.emit([
                    getNextAnnotationId(), {
                      start: selection.start,
                      end: selection.end,
                      motivation: this.annotationMotivation,
                      label: labels[this.annotationMotivation]
                    }
                  ]);
                }
              }
            }}
          ></ts-media-player>
        )}
        <ts-annotation-editor
          annotations={this._sequencedAnnotations}
          motivation={this.annotationMotivation}
          selectedAnnotation={this.selectedAnnotation}
          onAnnotationMouseOver={(e: CustomEvent<AnnotationTuple>) => {
            e.stopPropagation();
            this._highlightedAnnotation = e.detail;
          }}
          onAnnotationMouseOut={(e: CustomEvent<AnnotationTuple>) => {
            e.stopPropagation();
            this._highlightedAnnotation = null;
          }}
          onSelectAnnotation={(e: CustomEvent<AnnotationTuple | null>) => {
            e.stopPropagation();
            if (e.detail) {
              this.selectAnnotation.emit(e.detail[0]);
            } else {
              this.selectAnnotation.emit(null);
            }
          }}
          onSelectAnnotationMotivation={(e: CustomEvent<Motivation>) => {
            e.stopPropagation();
            this._highlightedAnnotation = null;
            this.selectAnnotationMotivation.emit(e.detail);
          }}
          onSetAnnotation={(e: CustomEvent<AnnotationTuple>) => {
            e.stopPropagation();
            this.setAnnotation.emit(e.detail);
          }}
          onDeleteAnnotation={(e: CustomEvent<AnnotationTuple>) => {
            e.stopPropagation();
            this._highlightedAnnotation = null;
            this.deleteAnnotation.emit(e.detail[0]);
          }}
          onReorderAnnotations={(e: CustomEvent<AnnotationMap>) => {
            e.stopPropagation();
            this.reorderAnnotations.emit(e.detail);
          }}
        ></ts-annotation-editor>
        {this._sequencedAnnotations.size > 0 && (
          <div class="options">
            <ion-button
              size="small"
              disabled={!this.remixedMedia || this.remixing}
              onClick={() => {
                window.open(getRemixedMediaUrl(this.remixedMedia).href);
              }}
            >
              <ion-icon name="download"></ion-icon>
            </ion-button>
            {/* <ion-button
              size="small"
              disabled={!this.remixedMedia || this.remixing}
              onClick={() => {
                this.save.emit(JSON.stringify(Array.from(this.annotations)));
              }}
            >
              <ion-icon name="save"></ion-icon>
            </ion-button> */}
          </div>
        )}
      </div>
    );
  }
}
