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
  @Prop() clipSelectionEnabled: boolean = false;
  @Prop({ mutable: true }) clipStart: number = 0;
  @Prop({ mutable: true }) clipEnd: number = 0;

  @Event() play: EventEmitter;
  @Event() pause: EventEmitter;
  @Event() scrubStart: EventEmitter;
  @Event() scrub: EventEmitter;
  @Event() scrubEnd: EventEmitter;
  @Event() clipChanged: EventEmitter;
  @Event() clipSelected: EventEmitter;

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

  // private _clipChanged(e: any): void {
  //   this.clipStart = e.lower;
  //   this.clipEnd = e.upper;
  //   this.clipChanged.emit({
  //     start: this.clipStart,
  //     end: this.clipEnd
  //   } as Clip);
  // }

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
                this.clockIsTicking && "Pause",
                !this.clockIsTicking && this._scrubbingWhilePlaying && "Pause",
                !this.clockIsTicking && !this._scrubbingWhilePlaying && "Play"
              ]}
            </ion-button>
          </div>
          <div class="col2 scrub-bar">
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
        {/* {
          this.clipSelectionEnabled ? (
            <div class="twocol clip-controls">
              <div class="col1 clip-select-button">
                <ion-button
                  disabled={this.disabled}
                  onClick={() => {
                    this.clipSelected.emit({
                      start: this.clipStart,
                      end: this.clipEnd
                    } as Clip);
                  }}
                >
                  Select
                </ion-button>
              </div>
              <div class="col2 clip-select">
                <ion-range
                  disabled={this.disabled}
                  pin={this.pin}
                  dual-knobs="true"
                  step={this.step}
                  min="0"
                  max={this.duration}
                  value={{ lower: this.clipStart, upper: this.clipEnd }}
                  onIonChange={e => this._clipChanged(e.detail.value)}
                ></ion-range>
              </div>
            </div>
          ) : null
        } */}
      </div>

    );
  }
}
