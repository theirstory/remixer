import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";
@Component({
  tag: "ts-console",
  styleUrl: "console.css",
  shadow: true
})
export class AlConsole {
  private _annotations: HTMLIonTextareaElement;

  @Event() public save: EventEmitter;

  @Prop({ mutable: true }) public data: string | null = null;
  @Prop({ mutable: true }) public tabSize: number = 2;
  @Prop() disabled: boolean = false;

  private _getJson(): string {
    let json: string = "";

    try {
      json = JSON.stringify(JSON.parse(this.data), undefined, this.tabSize);
    } catch {
      // do nothing
    }

    return json;
  }

  public render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <ion-textarea
          id="data"
          value={this._getJson()}
          rows={10}
          required
          onIonChange={e => (this.data = e.detail.value)}
          maxlength={5000}
          ref={el => (this._annotations = el)}
        />
        <ion-button
          size="small"
          type="submit"
          onClick={() => {
            if (this.data) {
              this.save.emit(this._annotations.value);
            }
          }}
        >
          Save
        </ion-button>
      </form>
    );
  }
}
