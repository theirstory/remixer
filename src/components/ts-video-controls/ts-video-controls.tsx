import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";

@Component({
  tag: "ts-video-controls",
  styleUrl: "ts-video-controls.css",
  shadow: false
})
export class TSVideoPlayer {

  private _scrubbing: boolean = false;
  private _scrubbingWhilePlaying: boolean = false;

  @Prop() clockIsTicking: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() duration: number = 0;
  @Prop() currentTime: number = 0;
  @Prop() step: number = 0.25;
  @Prop() pin: boolean = true;

  @Event() play: EventEmitter;
  @Event() pause: EventEmitter;
  @Event() scrubStart: EventEmitter;
  @Event() scrub: EventEmitter;
  @Event() scrubEnd: EventEmitter;

  private _scrubStart(e: number): void {
    if (this.clockIsTicking) {
      this._scrubbingWhilePlaying = true;
      this.pause.emit();
    }

    this._scrubbing = true;
    this.scrubStart.emit(e);
  }

  private _scrub(e: number): void {
    if (this._scrubbing) {
      this.scrub.emit(e);
    }
  }

  private _scrubEnd(e: number): void {
    if (this._scrubbingWhilePlaying) {
      this._scrubbingWhilePlaying = false;
      this.play.emit();
    }

    this._scrubbing = false;
    this.scrubEnd.emit(e);
  }

  render() {
    return (
      <div class="controls">
        <div class="play">
          <ion-button
            size="small"
            disabled={this.disabled}
            onClick={() => {
              {
                (this.clockIsTicking) ? this.pause.emit() : this.play.emit();
              }
            }}
          >
            {
              [
                ((this.clockIsTicking) && "Pause"),
                ((!this.clockIsTicking && this._scrubbingWhilePlaying) && "Pause"),
                ((!this.clockIsTicking && !this._scrubbingWhilePlaying) && "Play")
              ]
            }
          </ion-button>
        </div>
        <div class="scrub">
          <ion-range
            disabled={this.disabled}
            pin={this.pin}
            step={this.step}
            min="0"
            max={this.duration}
            value={this.currentTime}
            onIonChange={e => this._scrub(e.detail.value)}
            onMouseDown={e => this._scrubStart(e.target.value)}
            onMouseUp={e => this._scrubEnd(e.target.value)}
          ></ion-range>
        </div>
      </div>
    );
  }
}
