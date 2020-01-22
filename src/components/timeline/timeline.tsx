import {
  Component,
  Element,
  Event,
  h,
  Prop,
  EventEmitter,
  State,
  Watch,
  Listen
} from "@stencil/core";
import { TimelineChangeEventDetail, KnobName } from "./interfaces";
import {
  clamp,
  getCSSVar,
  removeCssUnits,
  valueToRatio,
  ratioToValue
} from "../../utils";
import {
  Gesture,
  createGesture,
  GestureDetail,
  HTMLStencilElement
} from "@ionic/core";
import { Motivation, AnnotationMap, Annotation } from "../../interfaces/Annotation";
import { SequencedDuration } from "../../interfaces/SequencedDuration";

@Component({
  tag: "ts-timeline",
  styleUrl: "timeline.css",
  shadow: true
})
export class Timeline {
  private _knobHandleSize: number = 0;
  private _timeline?: HTMLElement;
  private _gesture?: Gesture;
  private _selectionStarted: boolean = false;

  @Element() el!: HTMLStencilElement;

  @State() private _currentTimeRatio = 0;
  @State() private _selectionStartRatio = 0;
  @State() private _selectionEndRatio = 0;
  @State() private _pressedKnob: KnobName;

  @Prop() disabled: boolean;
  @Prop() duration: number;
  @Prop() annotations: AnnotationMap = new Map<string, Annotation>();
  @Prop() annotationEnabled: boolean;

  @Prop() selected: SequencedDuration;
  @Watch("selected")
  protected selectedChanged(newValue: SequencedDuration) {
    const startRatio: number = valueToRatio(
      newValue.sequencedStart,
      0,
      this.duration
    );
    const endRatio: number = valueToRatio(
      newValue.sequencedEnd,
      0,
      this.duration
    );
    this._select(startRatio, endRatio);
  }

  @Prop({ mutable: true }) currentTime: number = 0;
  @Watch("currentTime")
  protected currentTimeChanged() {
    this.updateRatios();
  }

  @Event() annotationChange: EventEmitter<SequencedDuration>;
  @Event() annotationEnd: EventEmitter<SequencedDuration>;
  @Event() annotationSelectionChange: EventEmitter<SequencedDuration>;
  @Event() annotationStart: EventEmitter<SequencedDuration>;
  @Event() scrub: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrubEnd: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrubStart: EventEmitter<TimelineChangeEventDetail>;

  connectedCallback() {
    this.updateRatios();
  }

  disconnectedCallback() {
    if (this._gesture) {
      this._gesture.destroy();
      this._gesture = undefined;
    }
  }

  async componentDidLoad() {
    // get css variables
    this._knobHandleSize = Number(
      removeCssUnits(getCSSVar("--timeline-knob-handle-size"))
    );

    const timeline: HTMLElement = this._timeline;

    if (timeline) {
      //timeline.oncontextmenu = () => { return false;}
      this._gesture = createGesture({
        el: timeline,
        gestureName: "timeline",
        gesturePriority: 100,
        threshold: 0,
        onStart: ev => this.onGestureStart(ev),
        onMove: ev => this.onGestureMove(ev),
        onEnd: ev => this.onGestureEnd(ev)
      });
      this._gesture.setDisabled(this.disabled);
    }
  }

  private onGestureStart(detail: GestureDetail) {
    const currentX = detail.currentX;
    const el: HTMLElement = (detail.event as any).toElement;
    if (el.classList.contains("start-selection")) {
      this._pressedKnob = "start-selection";
    } else if (el.classList.contains("playhead")) {
      this._pressedKnob = "playhead";
    } else if (el.classList.contains("end-selection")) {
      this._pressedKnob = "end-selection";
    }
    this.setFocus(this._pressedKnob);
    this.onGesture(currentX);
    this.scrubStart.emit({ currentTime: this.currentTime });
    if (this._selectionStarted) {
      this.annotationStart.emit(this.selection);
    }
  }

  private onGestureMove(detail: GestureDetail) {
    this.onGesture(detail.currentX);
    this.scrub.emit({ currentTime: this.currentTime });
    if (this._selectionStarted) {
      this.annotationChange.emit(this.selection);
    }
  }

  private onGestureEnd(detail: GestureDetail) {
    this.onGesture(detail.currentX);
    this.scrubEnd.emit({ currentTime: this.currentTime });
    if (this._selectionStarted) {
      this.annotationEnd.emit(this.selection);
    }
    this._pressedKnob = undefined;
  }

  // happens on gesture start, move, and end
  private onGesture(currentX: number) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    let ratio = clamp(
      0,
      (currentX - this.timelineRect!.left) / this.timelineRect!.width,
      1
    );

    this._currentTimeRatio = ratio;
    this.currentTime = this.playheadPosition;

    // if selecting
    if (this._pressedKnob !== undefined && this._pressedKnob !== "playhead") {
      let startRatio: number = this._selectionStartRatio;
      let endRatio: number = this._selectionEndRatio;

      if (this._pressedKnob === "start-selection") {
        startRatio = clamp(0, ratio, this._selectionEndRatio);
      } else {
        endRatio = clamp(this._selectionStartRatio, ratio, 1);
      }

      this._select(startRatio, endRatio);
    }
  }

  private _select(startRatio: number, endRatio: number): void {
    this._selectionStarted = true;

    this._selectionStartRatio = startRatio;
    this._selectionEndRatio = endRatio;

    this.annotationSelectionChange.emit(this.selection);
  }

  private get selection(): SequencedDuration {
    return {
      start: ratioToValue(this._selectionStartRatio, 0, this.duration),
      end: ratioToValue(this._selectionEndRatio, 0, this.duration)
    };
  }

  private get playheadPosition(): number {
    return ratioToValue(this._currentTimeRatio, 0, this.duration);
  }

  private get timelineRect(): ClientRect | null {
    if (this._timeline) {
      return this._timeline.getBoundingClientRect();
    }

    return null;
  }

  private updateRatios(): void {
    this._currentTimeRatio = valueToRatio(this.currentTime, 0, this.duration);
    if (!this._selectionStarted) {
      this._selectionStartRatio = this._currentTimeRatio;
      this._selectionEndRatio = this._currentTimeRatio;
    }
  }

  private setFocus(_knob: KnobName): void {
    if (this.el.shadowRoot) {
      const knob = this.el.shadowRoot.querySelector(
        `.timeline-knob-handle.${this._pressedKnob} .timeline-knob`
      ) as HTMLElement | undefined;
      if (knob) {
        knob.focus();
      }
    }
  }

  renderProgress() {
    return (
      <div
        class={{
          "timeline-bar progress": true
        }}
        style={{
          width: `${this._currentTimeRatio * 100}%`
        }}
        role="presentation"
      ></div>
    );
  }

  renderAnnotations() {
    if (!this.annotations) {
      return;
    }

    return Array.from(this.annotations).map(value => {
      const annotation = value[1];
      const start: number = valueToRatio(annotation.sequencedStart, 0, this.duration);
      const end: number = valueToRatio(annotation.sequencedEnd, 0, this.duration);
      const length: number = end - start;
      const timelineWidth: number = this.timelineRect?.width ?? 0;

      return (
        <div
          class={{
            annotation: true,
            "timeline-bar": true,
            bookmarking: annotation.motivation === Motivation.BOOKMARKING,
            highlighting: annotation.motivation === Motivation.HIGHLIGHTING
          }}
          style={{
            left: `${start * 100}%`,
            width: `${length * timelineWidth}px`
          }}
          role="presentation"
        ></div>
      );
    });
  }

  renderSelection() {
    if (!this._selectionStarted) {
      return;
    }

    const length: number = this._selectionEndRatio - this._selectionStartRatio;
    const timelineWidth: number = this.timelineRect?.width ?? 0;

    return (
      <div
        class={{
          selection: true,
          "timeline-bar": true
        }}
        style={{
          left: `${this._selectionStartRatio * 100}%`,
          width: `${length * timelineWidth}px`
        }}
        role="presentation"
      ></div>
    );
  }

  renderKnob(knob: KnobName, ratio: number) {
    return (
      <div
        class={{
          "timeline-knob-handle": true,
          selection: this.annotationEnabled,
          "start-selection": knob === "start-selection",
          playhead: knob === "playhead",
          "end-selection": knob === "end-selection"
        }}
        style={{
          left: `${ratio * 100}%`
        }}
        role="slider"
      >
        <div
          class={{
            "timeline-knob": true
          }}
          role="presentation"
        >
          {knob === "playhead" && !this.annotationEnabled && (
            <svg
              viewBox={`0 0 ${this._knobHandleSize} ${this._knobHandleSize}`}
            >
              <circle class="icon" cx="10" cy="10" r="10" />
            </svg>
          )}
          {knob === "playhead" && this.annotationEnabled && (
            <svg
              viewBox={`0 0 ${this._knobHandleSize} ${this._knobHandleSize}`}
            >
              <path class="icon" d="M10 20L0 10V0H20V10L10 20Z" />
            </svg>
          )}
          {knob === "start-selection" && (
            <svg
              viewBox={`0 0 ${this._knobHandleSize} ${this._knobHandleSize}`}
            >
              <path class="icon" d="M20 20L10 10H0V0H20V20Z" />
            </svg>
          )}
          {knob === "end-selection" && (
            <svg
              viewBox={`0 0 ${this._knobHandleSize} ${this._knobHandleSize}`}
            >
              <path class="icon" d="M0 20L10 10H20V0H0V20Z" />
            </svg>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="wrapper">
        <div
          class={{
            timeline: true,
            "annotation-disabled": !this.annotationEnabled,
            "annotation-enabled": this.annotationEnabled
          }}
          ref={el => (this._timeline = el)}
        >
          <div class="timeline-bar" role="presentation"></div>
          {this.renderProgress()}
          {this.renderAnnotations()}
          {this.annotationEnabled && [
            this.renderSelection(),
            this.renderKnob("start-selection", this._selectionStartRatio),
            this.renderKnob("end-selection", this._selectionEndRatio)
          ]}
          {this.renderKnob("playhead", this._currentTimeRatio)}
        </div>
      </div>
    );
  }

  @Listen("resize", { target: "window" })
  resizeHandler() {
    // if we don't force an update on resize, the highlights don't scale
    this.el.forceUpdate();
  }
}
