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

  @Prop() selectedAnnotation: string | null = null;

  @Event() annotationClick: EventEmitter<AnnotationTuple>;
  @Event() annotationMouseOut: EventEmitter<AnnotationTuple>;
  @Event() annotationMouseOver: EventEmitter<AnnotationTuple>;
  @Event() deleteAnnotation: EventEmitter<AnnotationTuple>;
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
          return this._annotations.map((annotation: AnnotationTuple) => {
            return (
              <ion-item
                onMouseOver={(_e: MouseEvent) => {
                  this.annotationMouseOver.emit(annotation);
                }}
                onMouseOut={(_e: MouseEvent) => {
                  this.annotationMouseOut.emit(annotation);
                }}
              >
                <ion-button
                  size="small"
                  slot="start"
                  onClick={() => {
                    this.deleteAnnotation.emit(annotation);
                  }}
                >
                  <ion-icon name="close"></ion-icon>
                </ion-button>
                <ion-label
                  class={{
                    selected: annotation[0] === this.selectedAnnotation,
                    target: true
                  }}
                  onClick={(_e: MouseEvent) => {
                    this.annotationClick.emit(annotation);
                  }}
                >
                  {annotation[1].target}
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
