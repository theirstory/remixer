import { Component, Event, h, Prop, EventEmitter, Watch, State } from "@stencil/core";
import { ItemReorderEventDetail } from "@ionic/core";
import { Annotation, AnnotationMap, AnnotationTuple } from "../../interfaces/Annotation";

@Component({
  tag: "ts-annotation-editor",
  styleUrl: "annotation-editor.css"
})
export class AnnotationEditor {

  @State() private _annotations: AnnotationTuple[] = [];

  @Prop({ mutable: true }) annotations: AnnotationMap = new Map<string, Annotation>();
  @Watch("annotations")
  async watchAnnotations(newValue) {
    this._annotations = Array.from(newValue);
  }

  @Event() annotationClick: EventEmitter<string>;
  @Event() annotationMouseOut: EventEmitter<string>;
  @Event() annotationMouseOver: EventEmitter<string>;
  @Event() deleteAnnotation: EventEmitter<string>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;

  private _reorderAnnotations(event: CustomEvent<ItemReorderEventDetail>) {
    const indexes: ItemReorderEventDetail = event.detail;
    const staging: AnnotationTuple[] = Array.from(this.annotations);

    const element = staging[indexes.from];
    staging.splice(indexes.from, 1);
    staging.splice(indexes.to, 0, element);

    const newAnnotations: AnnotationMap = new Map<string, Annotation>(Array.from(staging));

    event.detail.complete(this._annotations);
    this.annotations = newAnnotations;
    this.reorderAnnotations.emit(this.annotations);
  }

  render() {
    return (
      <ion-reorder-group
        disabled={false}
        onIonItemReorder={e => this._reorderAnnotations(e)}
      >
        {(() => {
          return this._annotations.map((a: AnnotationTuple) => {
            const [key, annotation] = a;
            return (
              <ion-item
                onMouseOver={(_e: MouseEvent) => {
                  this.annotationMouseOver.emit(key);
                }}
                onMouseOut={(_e: MouseEvent) => {
                  this.annotationMouseOut.emit(key);
                }}
                onClick={(_e: MouseEvent) => {
                  this.annotationClick.emit(key);
                }}
              >
                <ion-button
                  size="small"
                  slot="start"
                  onClick={() => {
                    this.deleteAnnotation.emit(key);
                  }}
                >
                  <ion-icon name="close"></ion-icon>
                </ion-button>
                <ion-label
                  class={{
                    target: true
                  }}
                >
                  {annotation.target}
                </ion-label>
                <ion-reorder slot="end"></ion-reorder>
              </ion-item>
            );
          })
        })()}

      </ion-reorder-group>
    );
  }
}
