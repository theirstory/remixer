import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter, State, Watch } from "@stencil/core";
import { getRemixedMediaUrl, sequenceAnnotations, round, getNextAnnotationId } from "../../utils";
import { Motivation, AnnotationMap, AnnotationTuple, Annotation } from "../../interfaces/Annotation";
import { SequencedDuration } from "../../interfaces/SequencedDuration";

@Component({
  tag: "ts-editor",
  styleUrl: "editor.css",
  shadow: false
})
export class Editor {

  @Prop() annotations: AnnotationMap;
  @Watch("annotations")
  protected selectedChanged() {
    // clear clips cache
    this._clips = null;
  }

  @Prop() annotationMotivation: Motivation;
  @Prop() remixing: boolean;
  @Prop() remixedMedia: string;
  @Prop() selectedAnnotationId: string;

  @Event() setAnnotation: EventEmitter<AnnotationTuple>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;
  @Event() deleteAnnotation: EventEmitter<string>;
  @Event() selectAnnotation: EventEmitter<string>;
  @Event() selectAnnotationMotivation: EventEmitter<Motivation>;

  @Event() save: EventEmitter<string>;

  @State() private _highlightedAnnotation: AnnotationTuple | null = null;

  private get _sequencedAnnotations(): AnnotationMap {
    return sequenceAnnotations(this.annotations);
  }

  private _getHighlights(): AnnotationMap {
    const highlights: AnnotationMap = new Map<string, Annotation>();

    if (this._highlightedAnnotation) {
      highlights.set(this._highlightedAnnotation[0], {
        ...this._sequencedAnnotations.get(this._highlightedAnnotation[0]),
        motivation: Motivation.HIGHLIGHTING
      });
    }

    return highlights;
  }

  private _clips: AnnotationMap | null = null;

  private get clips() {

    if (this._clips) {
      return this._clips;
    }

    return this._clips = new Map<string, Annotation>(Array.from(this.annotations).filter(anno => {
      return anno[1].motivation === Motivation.EDITING
    }));
  }

  private _selectedAnnotation: Annotation | null = null;

  private get selectedAnnotation() {

    if (this._selectedAnnotation) {
      return this._selectedAnnotation;
    }

    return this._selectedAnnotation = this.selectedAnnotationId ? this._sequencedAnnotations.get(this.selectedAnnotationId) : null;
  }

  render() {
    return (
      <div>
        {this.annotations.size > 0 && (
          <ts-media-player
            selected={this.selectedAnnotation}
            clips={this.clips}
            annotation-enabled={true}
            highlights={this._getHighlights()}
            onAnnotation={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();

              const selection: Annotation = e.detail;

              // if an annotation is selected
              if (this.selectedAnnotationId) {

                // retarget global timeline time to local clip time
                const duration: SequencedDuration = retargetSelection(selection, this.selectedAnnotation);

                this._selectedAnnotation = null;

                if ((round(duration.start) === round(duration.end)) && this.selectedAnnotation.motivation !== Motivation.BOOKMARKING) {
                  this.deleteAnnotation.emit(this.selectedAnnotationId);
                } else {
                  this.setAnnotation.emit([
                    this.selectedAnnotationId, {
                      ...selection,
                      motivation: selection.motivation ? selection.motivation : this.annotationMotivation,
                      start: duration.start,
                      end: duration.end
                    }
                  ]);
                }
              } else {
                // an annotation isn't already selected, create a new one
                // except if it's an edit, these can only be created in the cutting room
                if (this.annotationMotivation !== Motivation.EDITING) {
                  console.log("create annotation");
                  this.setAnnotation.emit([
                    getNextAnnotationId(), {
                      ...selection,
                      motivation: this.annotationMotivation
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
          selectedAnnotation={this.selectedAnnotationId}
          onAnnotationMouseOver={(e: CustomEvent<AnnotationTuple>) => {
            e.stopPropagation();
            this._highlightedAnnotation = e.detail;
          }}
          onAnnotationMouseOut={(e: CustomEvent<AnnotationTuple>) => {
            e.stopPropagation();
            this._highlightedAnnotation = null;
          }}
          onAnnotationClick={(e: CustomEvent<AnnotationTuple>) => {
            e.stopPropagation();
            this._selectedAnnotation = null;
            this.selectAnnotation.emit(e.detail[0]);
          }}
          onSelectAnnotationMotivation={(e: CustomEvent<Motivation>) => {
            e.stopPropagation();
            this.selectAnnotationMotivation.emit(e.detail);
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
          <div>
            <ion-button
              size="small"
              disabled={!this.remixedMedia || this.remixing}
              onClick={() => {
                window.open(getRemixedMediaUrl(this.remixedMedia).href);
              }}
            >
              <ion-icon name="download"></ion-icon>
            </ion-button>
            <ion-button
              size="small"
              disabled={!this.remixedMedia || this.remixing}
              onClick={() => {
                this.save.emit(JSON.stringify(this.annotations));
              }}
            >
              <ion-icon name="save"></ion-icon>
            </ion-button>
          </div>
        )}
      </div>
    );
  }
}

const retargetSelection = (selection: SequencedDuration, annotation: SequencedDuration) => {
  return {
    start: Math.max((selection.start - annotation.sequencedStart), 0) + annotation.start,
    end: Math.min((selection.end - annotation.sequencedEnd) + annotation.end, annotation.end)
  }
}
