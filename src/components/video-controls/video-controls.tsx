import { Component, h, Prop, Event, EventEmitter } from "@stencil/core";
import { TimelineChangeEventDetail } from "../timeline/interfaces";
import { Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-video-controls",
  styleUrl: "video-controls.css",
  shadow: false
})
export class VideoControls {
  // private _annotation: Annotation;
  private _scrubbingWhilePlaying: boolean = false;

  @Prop() annotationEnabled: boolean = false;
  //@Prop() editingEnabled: boolean = false;
  @Prop() isPlaying: boolean = false;
  @Prop() currentTime: number = 0;
  @Prop() disabled: boolean = false;
  @Prop() duration: number = 0;
  @Prop() annotations: Annotation[];

  @Event() annotation!: EventEmitter<Annotation>;
  //@Event() edit!: EventEmitter<Annotation>;
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

  render() {
    return (
      <div>
        <div class="timeline">
          <ts-timeline
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
            onAnnotationEnd={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              this.annotation.emit(e.detail);
            }}
            annotations={this.annotations}
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
          {/* <div class="actions">
            <ts-timeline-actions
              annotation={this._annotation}
              annotationEnabled={this.annotationEnabled}
              editingEnabled={this.editingEnabled}
              onAnnotate={(e: CustomEvent<Annotation>) => {
                e.stopPropagation();
                this.annotate.emit(e.detail);
              }}
              onEdit={(e: CustomEvent<Annotation>) => {
                e.stopPropagation();
                this.edit.emit(e.detail);
              }}
            ></ts-timeline-actions>
          </div> */}
        </div>
      </div>
    );
  }
}
