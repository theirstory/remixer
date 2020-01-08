import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";
import { TimelineChangeEventDetail } from "../ts-timeline/interfaces";
import { ClipChangeEventDetail } from "./interfaces";

@Component({
  tag: "ts-video-controls",
  styleUrl: "ts-video-controls.css",
  shadow: false
})
export class TSVideoPlayer {
  private _clipStart: number = 0;
  private _clipEnd: number;
  private _scrubbingWhilePlaying: boolean = false;

  @Prop() clipSelectionEnabled: boolean = false;
  @Prop() isPlaying: boolean = false;
  @Prop() currentTime: number = 0;
  @Prop() disabled: boolean = false;
  @Prop() duration: number = 0;
  @Prop() pin: boolean = true;
  @Prop() step: number = 0.25;

  @Event() clipChanged: EventEmitter<ClipChangeEventDetail>;
  @Event() clipSelected: EventEmitter<ClipChangeEventDetail>;
  @Event() pause: EventEmitter;
  @Event() play: EventEmitter;

  private _scrubStart(_e: CustomEvent<TimelineChangeEventDetail>): void {
    console.log("scrub start");
    if (this.isPlaying) {
      this._scrubbingWhilePlaying = true;
      this.pause.emit();
    }
  }

  private _scrubEnd(_e: CustomEvent<TimelineChangeEventDetail>): void {
    console.log("scrub end");
    if (this._scrubbingWhilePlaying) {
      this._scrubbingWhilePlaying = false;
      this.play.emit();
    }
  }

  private _clipChanged(e: ClipChangeEventDetail): void {
    this._clipStart = e.start;
    this._clipEnd = e.end;

    if (
      !this.isPlaying &&
      !isNaN(this._clipStart) &&
      !isNaN(this._clipEnd)
    ) {
      this.clipChanged.emit({
        start: this._clipStart,
        end: this._clipEnd
      });
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
                  this.isPlaying ? this.pause.emit() : this.play.emit();
                }
              }}
            >
              {[
                this.isPlaying && <ion-icon name="pause"></ion-icon>,
                !this.isPlaying && this._scrubbingWhilePlaying && (
                  <ion-icon name="pause"></ion-icon>
                ),
                !this.isPlaying && !this._scrubbingWhilePlaying && (
                  <ion-icon name="play"></ion-icon>
                )
              ]}
            </ion-button>
          </div>
          <div class="col2 timeline">
            <ts-timeline
              duration={this.duration}
              currentTime={this.currentTime}
              onScrubStart={(e:CustomEvent<TimelineChangeEventDetail>) => this._scrubStart(e)}
              onScrubEnd={(e:CustomEvent<TimelineChangeEventDetail>) => this._scrubEnd(e)}
            ></ts-timeline>
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
                  });
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
                onIonChange={(e:any) => this._clipChanged({
                  start: e.detail.value.lower,
                  end: e.detail.value.upper
                })}
              ></ion-range>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
