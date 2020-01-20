import { Component, Event, h, Prop } from "@stencil/core";
import { Annotation } from "../../interfaces/Annotation";
import { EventEmitter } from "@ionic/core/dist/types/stencil.core";
import AnnotateIcon from "../../assets/svg/annotate.svg";
import AddClipIcon from "../../assets/svg/add-clip.svg";

@Component({
  tag: "ts-timeline-actions",
  styleUrl: "timeline-actions.css"
})
export class TimelineActions {
  @Prop() annotation: Annotation;
  @Prop() annotationEnabled: boolean;
  @Prop() editingEnabled: boolean;

  @Event() edit: EventEmitter<Annotation>;
  @Event() annotate: EventEmitter<Annotation>;

  render() {
    // only render the edit button if a duration is selected
    // render the annotate button in all cases

    if (this.annotation) {
      return (
        <div>
          {this.editingEnabled && this.annotation.start !== this.annotation.end && (
            <ion-button
              size="small"
              onClick={() => {
                this.edit.emit(this.annotation);
              }}
            >
              <ion-icon color="primary" src={AddClipIcon}></ion-icon>
            </ion-button>
          )}
          {this.annotationEnabled &&  (
            <ion-button
              size="small"
              onClick={() => {
                this.annotate.emit(this.annotation);
              }}
            >
              <ion-icon color="primary" src={AnnotateIcon}></ion-icon>
            </ion-button>
          )}
        </div>
      )
    }

    return null;
  }
}

{/* <div>
  {this.annotation.start !== this.annotation.end && (
    <ion-button
      size="small"
      onClick={() => {
        this.edit.emit(this.annotation);
      }}
    >
      <ion-icon name="create"></ion-icon>
    </ion-button>
  )}
  <ion-button
    size="small"
    onClick={() => {
      this.annotate.emit(this.annotation);
    }}
  >
    <ion-icon name="chatbubbles"></ion-icon>
  </ion-button>
</div>; */}

// [
//   <ion-button
//     size="small"
//     onClick={() => {
//       this.annotate.emit(this.annotation);
//     }}
//   >
//     <ion-icon color="primary" src={AnnotateIcon}></ion-icon>
//   </ion-button>,
//   <ion-button
//     disabled={this.annotation.start === this.annotation.end}
//       size="small"
//       onClick={() => {
//         this.edit.emit(this.annotation);
//       }}
//     >
//       <ion-icon color="primary" src={AddClipIcon}></ion-icon>
//   </ion-button>
// ]
