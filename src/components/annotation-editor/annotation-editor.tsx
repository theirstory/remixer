import { Component, Event, h, Prop, EventEmitter, Watch, State } from "@stencil/core";
import { ItemReorderEventDetail } from "@ionic/core";
import { Annotation, AnnotationMap, AnnotationTuple, Motivation } from "../../interfaces/Annotation";
import { TextEditEventDetail } from "../text-editor/interfaces";
import { filterAnnotationsByMotivation, mergeAnnotationMaps } from "../../utils";

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

  @Event() setAnnotation: EventEmitter<AnnotationTuple>;
  @Event() selectAnnotation: EventEmitter<AnnotationTuple>;
  @Event() annotationMouseOut: EventEmitter<AnnotationTuple>;
  @Event() annotationMouseOver: EventEmitter<AnnotationTuple>;
  @Event() deleteAnnotation: EventEmitter<AnnotationTuple>;
  @Event() reorderAnnotations: EventEmitter<AnnotationMap>;
  @Event() selectAnnotationMotivation: EventEmitter<Motivation>;

  private _reorderAnnotations(event: CustomEvent<ItemReorderEventDetail>) {
    const indexes: ItemReorderEventDetail = event.detail;
    const staging: AnnotationTuple[] = Array.from(filterAnnotationsByMotivation(this.annotations, this.motivation));
    const nonReorderedAnnotations: AnnotationMap = filterAnnotationsByMotivation(this.annotations, this.motivation, true);

    const element = staging[indexes.from];
    staging.splice(indexes.from, 1);
    staging.splice(indexes.to, 0, element);

    const reorderedAnnotations: AnnotationMap = new Map<string, Annotation>(Array.from(staging));

    const mergedAnnotations: AnnotationMap = mergeAnnotationMaps(nonReorderedAnnotations, reorderedAnnotations);

    event.detail.complete(this._annotations);
    this.annotations = mergedAnnotations;
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
            <div class="motivation">
              <select
                onChange={e => {
                  this._changeAnnotationMotivation((e.srcElement as HTMLSelectElement)
                    .value as Motivation)
                }}
              >
                <option
                  selected={this.motivation === Motivation.EDITING}
                  value={Motivation.EDITING}
                >
                  Edit
                </option>
                <option
                  selected={this.motivation === Motivation.COMMENTING}
                  value={Motivation.COMMENTING}
                >
                  Comment
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
                        body: true
                      }}
                      onClick={(_e: MouseEvent) => {
                        this.selectAnnotation.emit(annotation);
                      }}
                    >
                      {annotation[1].label || annotation[1].body}
                    </ion-label>
                    <ion-reorder slot="end"></ion-reorder>
                  </ion-item>
                );
              })
          })()}

        </ion-reorder-group>
        {
          this.selectedAnnotation && (
            <ts-text-editor
              label={this.selectedAnnotation[1].label}
              description={this.selectedAnnotation[1].body}
              descriptionEnabled={this.motivation !== Motivation.EDITING}
              onChange={(e: CustomEvent<TextEditEventDetail>) => {
                e.stopPropagation();
                if (e.detail) {
                  this.setAnnotation.emit([
                    this.selectedAnnotation[0],
                    {
                      ...this.selectedAnnotation[1],
                      label: e.detail.label,
                      body: e.detail.description
                    }
                  ]);
                }
              }}
              onClose={(e: CustomEvent) => {
                e.stopPropagation();
                this.selectAnnotation.emit(null);
              }}
              >
            </ts-text-editor>
          )
        }
      </div>
    );
  }
}
