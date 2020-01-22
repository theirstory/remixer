import { Component, Event, h, Prop, EventEmitter } from "@stencil/core";
import { ItemReorderEventDetail } from "@ionic/core";
import { Annotation, AnnotationMap, AnnotationMapTuple } from "../../interfaces/Annotation";

@Component({
  tag: "ts-annotation-editor",
  styleUrl: "annotation-editor.css"
})
export class AnnotationEditor {
  @Prop({ mutable: true }) annotations: AnnotationMap = new Map<string, Annotation>();

  @Event() annotationClick: EventEmitter<string>;
  @Event() annotationMouseOut: EventEmitter<string>;
  @Event() annotationMouseOver: EventEmitter<string>;
  @Event() deleteAnnotation: EventEmitter<string>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;

  private _reorderAnnotations(event: CustomEvent<ItemReorderEventDetail>) {
    const indexes: ItemReorderEventDetail = event.detail;

    console.log("reorder", indexes);

    // const newAnnotations: Annotation[] = [...this.annotations];

    // let element = this.annotations[indexes.from];
    // newAnnotations.splice(indexes.from, 1);
    // newAnnotations.splice(indexes.to, 0, element);

    // event.detail.complete(this.annotations);
    // this.annotations = newAnnotations;
    // this.reorderAnnotations.emit(this.annotations);
  }

  render() {
    return (
      <ion-reorder-group
        disabled={false}
        onIonItemReorder={e => this._reorderAnnotations(e)}
      >
        {(() => {
          return Array.from(this.annotations).map((a: AnnotationMapTuple) => {
            const [annotationId, annotation] = a;
            return (
              <ion-item
                onMouseOver={(_e: MouseEvent) => {
                  this.annotationMouseOver.emit(annotationId);
                }}
                onMouseOut={(_e: MouseEvent) => {
                  this.annotationMouseOut.emit(annotationId);
                }}
                onClick={(_e: MouseEvent) => {
                  this.annotationClick.emit(annotationId);
                }}
              >
                <ion-label
                  class={{
                    target: true
                  }}
                >
                  {annotation.target}
                </ion-label>
                <ion-button
                  size="small"
                  onClick={() => {
                    this.deleteAnnotation.emit(annotationId);
                  }}
                >
                  <ion-icon name="close"></ion-icon>
                </ion-button>
                <ion-reorder slot="end"></ion-reorder>
              </ion-item>
            );
          })
        })()}

      </ion-reorder-group>
    );
  }
}
