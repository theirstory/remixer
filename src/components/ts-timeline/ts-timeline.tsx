import { Component, Element, Event, h, Prop, EventEmitter, State, Watch } from "@stencil/core";
import { TimelineChangeEventDetail } from "./interfaces";
import { clamp } from "../../utils";
import { Gesture, createGesture, GestureDetail } from "@ionic/core";

@Component({
  tag: "ts-timeline",
  styleUrl: "ts-timeline.css",
  shadow: true
})
export class TSTimeline {

  private _timeline?: HTMLElement;
  private _rect!: ClientRect;
  private _gesture?: Gesture;

  @Element() el!: HTMLDivElement;

  @State() private currentTimeRatio = 0;
  //@State() private pressedKnob: KnobName;

  @Prop() disabled: boolean;
  @Prop() duration: number;

  @Prop({ mutable: true }) currentTime: number = 0;
  @Watch("currentTime")
  protected currentTimeChanged(currentTime: number) {
    this.updateRatio();
    currentTime = this.ensureValueInBounds(currentTime);
  }

  private clampBounds = (value: any): number => {
    return clamp(0, value, this.duration);
  }

  private ensureValueInBounds = (value: any) => {
    return this.clampBounds(value);
  }

  @Event() scrubStart!: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrub!: EventEmitter<TimelineChangeEventDetail>;
  @Event() scrubEnd!: EventEmitter<TimelineChangeEventDetail>;

  connectedCallback() {
    this.updateRatio();
  }

  disconnectedCallback() {
    if (this._gesture) {
      this._gesture.destroy();
      this._gesture = undefined;
    }
  }

  async componentDidLoad() {
    const timeline = this._timeline;
    if (timeline) {
      this._gesture = createGesture({
        el: timeline,
        gestureName: "timeline",
        gesturePriority: 100,
        threshold: 0,
        onStart: ev => this.onGestureStart(ev),
        onMove: ev => this.onGestureMove(ev),
        onEnd: ev => this.onGestureEnd(ev),
      });
      this._gesture.setDisabled(this.disabled);
    }
  }

  private onGestureStart(detail: GestureDetail) {
    this._rect = this._timeline!.getBoundingClientRect();
    const currentX = detail.currentX;
    //this.pressedKnob = "PLAYHEAD";
    //this.setFocus(this.pressedKnob);
    this.onGesture(currentX);
    this.scrubStart.emit({ currentTime: this.currentTime });
  }

  private onGestureMove(detail: GestureDetail) {
    this.onGesture(detail.currentX);
    this.scrub.emit({ currentTime: this.currentTime });
  }

  private onGestureEnd(detail: GestureDetail) {
    this.onGesture(detail.currentX);
    this.scrubEnd.emit({ currentTime: this.currentTime });
    //this.pressedKnob = undefined;
  }

  private onGesture(currentX: number) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    const rect = this._rect;
    let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);

    // update which knob is pressed
    //if (this.pressedKnob === "PLAYHEAD") {
      this.currentTimeRatio = ratio;
    //}

    this.currentTime = this.playheadPosition;
  }

  private get playheadPosition() {
    return ratioToValue(this.currentTimeRatio, 0, this.duration);
  }

  private updateRatio() {
    this.currentTimeRatio = valueToRatio(this.currentTime, 0, this.duration);
  }

  // private setFocus(knob: KnobName) {
  //   if (this.el.shadowRoot) {
  //     const playheadEl = this.el.shadowRoot.querySelector(knob === "PLAYHEAD" ? ".timeline-playhead" : "") as HTMLElement | undefined;
  //     if (playheadEl) {
  //       playheadEl.focus();
  //     }
  //   }
  // }

  render() {
    return (
      <div class="timeline" ref={el => this._timeline = el}>
        <div class="timeline-bar" role="presentation"></div>
        {/* <progress
          id="progress"
          max={this.duration}
          value={this.currentTime}
          tabindex="0"
          role="presentation"
          aria-label="progress"
          aria-valuemin="0"
          aria-valuemax={this.duration}
          aria-valuenow={this.currentTime}
        ></progress> */}
        <div class="timeline-bar timeline-bar-active"></div>
        { renderPlayhead(this.currentTimeRatio )}
      </div>
    );
  }
}

const renderPlayhead = (ratio: number) => {
  const playheadStyle = () => {
    const style: any = {};
    style["left"] = `${ratio * 100}%`;
    return style;
  };

  return (
    <div
      class={{
        "timeline-knob-handle": true
      }}
      style={playheadStyle()}
      role="slider"
    >
      <div class="timeline-knob playhead" role="presentation" />
    </div>
  );
}

function ratioToValue(
  ratio: number,
  min: number,
  max: number
): number {
  let value = (max - min) * ratio;
  return clamp(min, value, max);
}

function valueToRatio(value: number, min: number, max: number): number {
  return clamp(0, (value - min) / (max - min), 1);
}
