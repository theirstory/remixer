import { Component, Event, h, Prop, EventEmitter } from "@stencil/core";
import { ItemReorderEventDetail } from "@ionic/core";
import { Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-annotation-editor",
  styleUrl: "annotation-editor.css"
})
export class AnnotationEditor {

  @Prop({ mutable: true }) annotations: Annotation[] = [];

  @Event() reorderedAnnotations: EventEmitter<Annotation[]>;
  @Event() annotationMouseOver: EventEmitter<Annotation>;
  @Event() annotationMouseOut: EventEmitter<Annotation>;
  @Event() annotationClick: EventEmitter<Annotation>;
  @Event() deleteAnnotation: EventEmitter<Annotation>;

  private _reorderAnnotations(event: CustomEvent<ItemReorderEventDetail>) {
    const indexes: ItemReorderEventDetail = event.detail;

    const newAnnotations: Annotation[] = [...this.annotations];

    let element = this.annotations[indexes.from];
    newAnnotations.splice(indexes.from, 1);
    newAnnotations.splice(indexes.to, 0, element);

    event.detail.complete(this.annotations);
    this.annotations = newAnnotations;
    this.reorderedAnnotations.emit(this.annotations);
  }

  render() {
    return (
      <ion-reorder-group
        disabled={false}
        onIonItemReorder={e => this._reorderAnnotations(e)}
      >
        {this.annotations.map((annotation: Annotation) => {
          return (
            <ion-item
              onMouseOver={(_e: MouseEvent) => {
                this.annotationMouseOver.emit(annotation);
              }}
              onMouseOut={(_e: MouseEvent) => {
                this.annotationMouseOut.emit(annotation);
              }}
              onClick={(_e: MouseEvent) => {
                this.annotationClick.emit(annotation);
              }}
            >
              <ion-label class={{
                target: true
              }}>{annotation.target}</ion-label>
              <ion-button
                size="small"
                onClick={() => {
                  this.deleteAnnotation.emit(annotation);
                }}
              >
                <ion-icon name="close"></ion-icon>
              </ion-button>
              <ion-reorder slot="end"></ion-reorder>
            </ion-item>
          );
        })}
      </ion-reorder-group>
    );
  }
}
