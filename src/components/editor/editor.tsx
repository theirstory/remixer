import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter, State } from "@stencil/core";
import { getRemixedMediaUrl, sequenceAnnotations, round } from "../../utils";
import { Motivation, AnnotationMap, AnnotationTuple, Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-editor",
  styleUrl: "editor.css",
  shadow: false
})
export class Editor {
  @Prop() annotations: AnnotationMap;
  @Prop() remixing: boolean;
  @Prop() remixedMedia: string;
  @Prop() selectedAnnotation: string;

  @Event() updateAnnotation: EventEmitter<AnnotationTuple>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;
  @Event() deleteAnnotation: EventEmitter<string>;
  @Event() selectAnnotation: EventEmitter<string>;

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

  // private get selected(): Annotation | null {

  //   const annotation: Annotation | undefined = this._sequencedAnnotations.get(this._selectedId);

  //   if (annotation) {
  //     if (this._selected && sequencedDurationsAreEqual(this._selected, annotation)) {
  //       return this._selected;
  //     }

  //     return this._selected = {
  //       sequencedStart: annotation.sequencedStart,
  //       sequencedEnd: annotation.sequencedEnd
  //     }
  //   }

  //   return null;
  // }

  render() {

    const selectedAnnotation: Annotation | null = this.selectedAnnotation ? this._sequencedAnnotations.get(this.selectedAnnotation) : null;

    return (
      <div>
        {this.annotations.size > 0 && (
          <ts-media-player
            selected={selectedAnnotation}
            annotations={this.annotations}
            annotation-enabled={true}
            highlights={this._getHighlights()}
            onAnnotation={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();

              if (this.selectedAnnotation) {
                const selection: Annotation = e.detail;

                switch (selectedAnnotation.motivation) {
                  case Motivation.EDITING : {

                    // retarget global timeline time to local clip time
                    const start: number = (selection.start - selectedAnnotation.sequencedStart) + selectedAnnotation.start;
                    const end: number = (selection.end - selectedAnnotation.sequencedEnd) + selectedAnnotation.end;

                    if (round(start) === round(end)) {
                      this.deleteAnnotation.emit(this.selectedAnnotation);
                    } else {
                      this.updateAnnotation.emit([
                        this.selectedAnnotation, {
                          ...selection,
                          start: start,
                          end: end
                        }
                      ]);
                    }

                    break;
                  }
                }
              }
            }}
          ></ts-media-player>
        )}
        <ts-annotation-editor
          annotations={this._sequencedAnnotations}
          selectedAnnotation={this.selectedAnnotation}
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
            this.selectAnnotation.emit(e.detail[0]);
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
