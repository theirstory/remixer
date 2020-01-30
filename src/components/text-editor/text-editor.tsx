import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { TextEditEventDetail } from "./interfaces";

@Component({
  tag: "ts-text-editor",
  styleUrl: "text-editor.css"
})
export class TextEditor {

  @Prop({ mutable: true }) label: string;
  @Prop({ mutable: true }) description: string;
  @Prop() descriptionEnabled: boolean = true;

  @Event() change: EventEmitter<TextEditEventDetail>;
  @Event() close: EventEmitter<CustomEvent>;

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <ion-input
          id="label"
          value={this.label}
          placeholder="title"
          required
          onIonChange={e => {
            this.label = e.detail.value;
            this.change.emit({
              label: this.label,
              description: this.description
            })
          }}
          maxlength={20}
        />
        {
          this.descriptionEnabled && (
            <ion-textarea
              id="description"
              value={this.description}
              placeholder="description"
              rows={5}
              onIonChange={e => {
                this.description = e.detail.value;
                this.change.emit({
                  label: this.label,
                  description: this.description
                })
              }}
              maxlength={280}
            />
          )
        }
        {/* <ion-button
          size="small"
          onClick={() => {
            this.save.emit({
              label: this.label,
              description: this.description
            });
          }}
        >
          save
        </ion-button> */}
        <ion-button
          size="small"
          type="submit"
          onClick={() => {
            this.close.emit();
          }}
        >
          close
        </ion-button>
      </form>
    );
  }
}
