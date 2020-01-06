import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";

@Component({
  tag: "ts-video-controls",
  styleUrl: "ts-video-controls.css",
  shadow: false
})
export class TSVideoPlayer {
  private _clipStart: number = 0;
  private _clipEnd: number;
  private _scrubbing: boolean = false;
  private _scrubbingWhilePlaying: boolean = false;

  @Prop() clipSelectionEnabled: boolean = false;
  @Prop() clockIsTicking: boolean = false;
  @Prop() currentTime: number = 0;
  @Prop() disabled: boolean = false;
  @Prop() duration: number = 0;
  @Prop() pin: boolean = true;
  @Prop() step: number = 0.25;

  @Event() clipChanged: EventEmitter;
  @Event() clipSelected: EventEmitter;
  @Event() pause: EventEmitter;
  @Event() play: EventEmitter;
  @Event() scrub: EventEmitter;
  @Event() scrubEnd: EventEmitter;
  @Event() scrubStart: EventEmitter;

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

  private _clipChanged(e: any): void {
    this._clipStart = e.lower;
    this._clipEnd = e.upper;

    if (
      !this.clockIsTicking &&
      !isNaN(this._clipStart) &&
      !isNaN(this._clipEnd)
    ) {
      this.clipChanged.emit({
        start: this._clipStart,
        end: this._clipEnd
      } as Clip);
    }
  }

  render() {
    return (
      <div class="controls">
        <div class="twocol play-controls">
          <div class="col1 play-button">
            <ion-button
              size="small"
              disabled={this.disabled}
              onClick={() => {
                {
                  this.clockIsTicking ? this.pause.emit() : this.play.emit();
                }
              }}
            >
              {[
                this.clockIsTicking && <ion-icon name="pause"></ion-icon>,
                !this.clockIsTicking && this._scrubbingWhilePlaying && (
                  <ion-icon name="pause"></ion-icon>
                ),
                !this.clockIsTicking && !this._scrubbingWhilePlaying && (
                  <ion-icon name="play"></ion-icon>
                )
              ]}
            </ion-button>
          </div>
          <div class="col2 scrub-bar">
            <ion-range
              disabled={this.disabled}
              pin={this.pin}
              step={this.step}
              min={0}
              max={this.duration}
              value={this.currentTime}
              onIonChange={e => this._scrub(e.detail.value as number)}
              onMouseDown={e => this._scrubStart((e.target as any).value)}
              onMouseUp={e => this._scrubEnd((e.target as any).value)}
            ></ion-range>
          </div>
        </div>
        {this.clipSelectionEnabled ? (
          <div class="twocol clip-controls">
            <div class="col1 clip-select-button">
              <ion-button
                disabled={this.disabled}
                onClick={() => {
                  this.clipSelected.emit({
                    start: this._clipStart,
                    end: this._clipEnd
                  } as Clip);
                }}
              >
                <ion-icon name="cut"></ion-icon>
              </ion-button>
            </div>
            <div class="col2 clip-select">
              <ion-range
                disabled={this.disabled}
                pin={this.pin}
                dual-knobs="true"
                step={this.step}
                min={0}
                max={this.duration}
                value={{
                  lower: !isNaN(this._clipStart) ? this._clipStart : 0,
                  upper: !isNaN(this._clipEnd) ? this._clipEnd : this.duration
                }}
                onIonChange={e => this._clipChanged(e.detail.value)}
              ></ion-range>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
