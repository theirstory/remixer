import { Component, Event, h, Prop, EventEmitter, Watch, State } from "@stencil/core";
import { ItemReorderEventDetail } from "@ionic/core";
import { Annotation, AnnotationMap, AnnotationTuple, Motivation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-annotation-editor",
  styleUrl: "annotation-editor.css"
})
export class AnnotationEditor {

  @State() private _annotations: AnnotationTuple[] = [];

  @Prop({ mutable: true }) annotations: AnnotationMap = new Map<string, Annotation>();
  @Watch("annotations")
  async watchAnnotations(newValue) {
    // map has to be turned into an array for reordering
    this._annotations = Array.from(newValue);
  }

  @Prop() selectedAnnotation: AnnotationTuple | null = null;
  @Prop() motivation: Motivation = Motivation.EDITING;

  @Event() annotationClick: EventEmitter<AnnotationTuple>;
  @Event() annotationMouseOut: EventEmitter<AnnotationTuple>;
  @Event() annotationMouseOver: EventEmitter<AnnotationTuple>;
  @Event() deleteAnnotation: EventEmitter<AnnotationTuple>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;
  @Event() selectAnnotationMotivation: EventEmitter<Motivation>;

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

  private _changeAnnotationMotivation(motivation: Motivation) {
    this.selectAnnotationMotivation.emit(motivation);
  }

  render() {
    return (
      <div>
        {
          this.annotations.size > 0 && (
            <div>
              <select
                onChange={e =>
                  this._changeAnnotationMotivation((e.srcElement as HTMLSelectElement)
                    .value as Motivation)
                }
              >
                <option
                  selected={this.motivation === Motivation.EDITING}
                  value={Motivation.EDITING}
                >
                  {Motivation.EDITING}
                </option>
                <option
                  selected={this.motivation === Motivation.COMMENTING}
                  value={Motivation.COMMENTING}
                >
                  {Motivation.COMMENTING}
                </option>
              </select>
            </div>
          )
        }
        <ion-reorder-group
          disabled={false}
          onIonItemReorder={e => this._reorderAnnotations(e)}
        >
          {(() => {

            const selectedAnnotationId: string | null = this.selectedAnnotation ? this.selectedAnnotation[0] : null;

            return this._annotations.filter((annotation: AnnotationTuple) => {
              return annotation[1].motivation === this.motivation; }).map((annotation: AnnotationTuple) => {
                return(
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
                        selected: annotation[0] === selectedAnnotationId,
                        target: true
                      }}
                      onClick={(_e: MouseEvent) => {
                        console.log(annotation);
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
      </div>
    );
  }
}
