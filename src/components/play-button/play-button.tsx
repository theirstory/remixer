import { Component, h, Event, EventEmitter, Prop } from "@stencil/core";
import PauseIcon from "../../assets/svg/pause.svg";
import PlayIcon from "../../assets/svg/play.svg";

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
        <ion-icon color="primary" src={
          this.playing && PauseIcon || !this.playing && this.scrubbingWhilePlaying && PauseIcon || !this.playing && !this.scrubbingWhilePlaying && PlayIcon
        }></ion-icon>
      </ion-button>
    );
  }
}
