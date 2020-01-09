import { Component, h, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  tag: "ts-play-button",
  styleUrl: "play-button.css"
})
export class PlayButton {

  @Prop() playing: boolean;
  @Prop() scrubbingWhilePlaying: boolean;
  @Prop() disabled: boolean;

  @Event() play: EventEmitter;
  @Event() pause: EventEmitter;

  render() {
    return (
      <ion-button
        class="control"
        size="small"
        disabled={this.disabled}
        aria-label={this.playing ? "Pause" : "Play"}
        onClick={() => {
          {
            this.playing ? this.pause.emit() : this.play.emit();
          }
        }}
      >
        {[
          this.playing && <ion-icon name="pause"></ion-icon>,
          !this.playing && this.scrubbingWhilePlaying && (
            <ion-icon name="pause"></ion-icon>
          ),
          !this.playing && !this.scrubbingWhilePlaying && (
            <ion-icon name="play"></ion-icon>
          )
        ]}
      </ion-button>
    );
  }

}
