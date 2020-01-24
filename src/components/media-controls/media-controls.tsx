import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { TimelineChangeEventDetail } from "../timeline/interfaces";
import { AnnotationMap } from "../../interfaces/Annotation";
import { Duration } from "../../interfaces/Duration";
import { SequencedDuration } from "../../interfaces/SequencedDuration";

@Component({
  tag: "ts-media-controls",
  styleUrl: "media-controls.css",
  shadow: false
})
export class MediaControls {
  private _scrubbingWhilePlaying: boolean = false;

  @Prop() annotationEnabled: boolean = false;
  @Prop() isPlaying: boolean = false;
  @Prop() currentTime: number = 0;
  @Prop() disabled: boolean = false;
  @Prop() duration: number = 0;
  @Prop() highlights: AnnotationMap | null = null;
  @Prop() selected: SequencedDuration | null = null;

  @Event() annotation: EventEmitter<Duration>;
  @Event() annotationSelectionChange: EventEmitter<Duration>;
  @Event() pause: EventEmitter;
  @Event() play: EventEmitter;
  @Event() scrub: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrubEnd: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrubStart: EventEmitter<TimelineChangeEventDetail>;

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

  render() {
    return (
      <div>
        <div class="timeline">
          <ts-timeline
            selected={this.selected}
            duration={this.duration}
            currentTime={this.currentTime}
            annotationEnabled={this.annotationEnabled}
            onScrub={(e: CustomEvent<TimelineChangeEventDetail>) => {
              e.stopPropagation();
              this._scrub(e.detail);
            }}
            onScrubStart={(e: CustomEvent<TimelineChangeEventDetail>) => {
              e.stopPropagation();
              this._scrubStart(e.detail);
            }}
            onScrubEnd={(e: CustomEvent<TimelineChangeEventDetail>) => {
              e.stopPropagation();
              this._scrubEnd(e.detail);
            }}
            onAnnotationEnd={(e: CustomEvent<SequencedDuration>) => {
              e.stopPropagation();
              this.annotation.emit(e.detail);
            }}
            onAnnotationSelectionChange={(e: CustomEvent<SequencedDuration>) => {
              e.stopPropagation();
              this.annotationSelectionChange.emit(e.detail);
            }}
            highlights={this.highlights}
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
                this.play.emit();
              }}
              onPause={(e: CustomEvent) => {
                e.stopPropagation();
                this.pause.emit();
              }}
            ></ts-play-button>
          </div>
          <div class="time">
            <ts-time
              class="control"
              currentTime={this.currentTime}
              duration={this.duration}
            ></ts-time>
          </div>
        </div>
      </div>
    );
  }
}
