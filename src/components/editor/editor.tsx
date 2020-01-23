import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter, State } from "@stencil/core";
import { getRemixedMediaUrl, sequenceAnnotations } from "../../utils";
import { Motivation, AnnotationMap, AnnotationTuple, Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-editor",
  styleUrl: "editor.css",
  shadow: false
})
export class Editor {
  @Prop({ mutable: true }) annotations: AnnotationMap;
  @Prop() remixing: boolean;
  @Prop() remixedMedia: string;

  @Event() updateAnnotation: EventEmitter<AnnotationTuple>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;
  @Event() deleteAnnotation: EventEmitter<string>;
  @Event() save: EventEmitter<string>;

  //private _mediaPlayer: HTMLTsMediaPlayerElement;
  @State() private _highlightedAnnotation: string | null = null;
  @State() private _selected: string | null = null;

  get sequencedAnnotations(): AnnotationMap {
    return sequenceAnnotations(this.annotations);
  }

  private _getHighlights(): AnnotationMap {
    const highlights: AnnotationMap = new Map<string, Annotation>();

    if (this._highlightedAnnotation) {
      highlights.set(this._highlightedAnnotation, {
        ...this.sequencedAnnotations.get(this._highlightedAnnotation),
        motivation: Motivation.HIGHLIGHTING
      });
    }

    return highlights;
  }

  render() {
    return (
      <div>
        {this.annotations.size > 0 && (
          <ts-media-player
            //ref={el => (this._mediaPlayer = el)}
            selected={this._selected}
            annotations={this.annotations}
            annotation-enabled={true}
            highlights={this._getHighlights()}
            onAnnotationSelectionChange={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              console.log(e.detail);
              //this.updateAnnotation.emit(e.detail);
            }}
          ></ts-media-player>
        )}
        <ts-annotation-editor
          annotations={this.sequencedAnnotations}
          onAnnotationMouseOver={(e: CustomEvent<string>) => {
            e.stopPropagation();
            this._highlightedAnnotation = e.detail;
          }}
          onAnnotationMouseOut={(e: CustomEvent<string>) => {
            e.stopPropagation();
            this._highlightedAnnotation = null;
          }}
          onAnnotationClick={(e: CustomEvent<string>) => {
            e.stopPropagation();
            this._selected = e.detail;
            //this._mediaPlayer.selectAnnotation(e.detail);
          }}
          onDeleteAnnotation={(e: CustomEvent<string>) => {
            e.stopPropagation();
            this.deleteAnnotation.emit(e.detail);
          }}
          onReorderAnnotations={(e: CustomEvent<AnnotationMap>) => {
            e.stopPropagation();
            this.reorderAnnotations.emit(e.detail);
          }}
        ></ts-annotation-editor>
        {this.sequencedAnnotations.size > 0 && (
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
