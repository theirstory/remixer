import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { TimelineChangeEventDetail, Range } from "../timeline/interfaces";
import { ClipChangeEventDetail } from "./interfaces";

@Component({
  tag: "ts-video-controls",
  styleUrl: "video-controls.css",
  shadow: false
})
export class TSVideoControls {
  private _clipStart: number = 0;
  private _clipEnd: number;
  private _scrubbingWhilePlaying: boolean = false;

  @Prop() clipSelectionEnabled: boolean = false;
  @Prop() isPlaying: boolean = false;
  @Prop() currentTime: number = 0;
  @Prop() disabled: boolean = false;
  @Prop() duration: number = 0;
  @Prop() ranges: Range[];

  @Event() clipChanged!: EventEmitter<ClipChangeEventDetail>;
  @Event() clipSelected!: EventEmitter<ClipChangeEventDetail>;
  @Event() pause!: EventEmitter;
  @Event() play!: EventEmitter;
  @Event() scrubStart!: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrub!: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrubEnd!: EventEmitter<TimelineChangeEventDetail>;

  private _scrubStart(e: TimelineChangeEventDetail): void {
    if (this.isPlaying) {
      this._scrubbingWhilePlaying = true;
      this.pause.emit();
    }
    this.scrubStart.emit(e);
  }

  private _scrub(e: TimelineChangeEventDetail): void {
    this.scrub.emit(e);
  }

  private _scrubEnd(e: TimelineChangeEventDetail): void {
    if (this._scrubbingWhilePlaying) {
      this._scrubbingWhilePlaying = false;
      this.play.emit();
    }
    this.scrubEnd.emit(e);
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
      <div>
        <div class="timeline">
          <ts-timeline
            duration={this.duration}
            currentTime={this.currentTime}
            selectionEnabled={this.clipSelectionEnabled}
            onScrub={(e: CustomEvent<TimelineChangeEventDetail>) => {
              e.stopPropagation();
              this._scrub(e.detail);
            }}
            onScrubStart={(e: CustomEvent<TimelineChangeEventDetail>) => {
              e.stopPropagation();
              this._scrubStart(e.detail);
            }}
            onScrubEnd={(e: CustomEvent<TimelineChangeEventDetail>) => {
              e.stopPropagation()
              this._scrubEnd(e.detail)
            }}
            ranges={this.ranges}
          ></ts-timeline>
        </div>
        <div class="controls">
          <div class="play">
            <ts-play-button
              disabled={this.disabled}
              playing={this.isPlaying}
              scrubbingWhilePlaying={this._scrubbingWhilePlaying}
              onPlay={(e: CustomEvent) => {
                e.stopPropagation();
                this.play.emit()
              }}
              onPause={(e: CustomEvent) => {
                e.stopPropagation();
                this.pause.emit()
              }}
            >
            </ts-play-button>
          </div>
          <div class="time">
            <ts-time class="control" currentTime={this.currentTime} duration={this.duration}></ts-time>
          </div>
          <div class="empty">

          </div>
        </div>

        {/* {this.clipSelectionEnabled ? (
          <div class="clip-controls">
            <div class="clip-select">
              <ion-range
                disabled={this.disabled}
                dual-knobs="true"
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
            <div class="col1 clip-select-button">
              <ion-button
                size="small"
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
          </div>
        ) : null} */}
      </div>
    );
  }
}
