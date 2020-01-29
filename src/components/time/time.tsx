import { Component, h, Prop } from "@stencil/core";
import { formatTime } from "../../utils";

@Component({
  tag: "ts-time",
  styleUrl: "time.css"
})
export class Time {
  @Prop() currentTime: number;
  @Prop() duration: number;

  render() {
    return (
      (this.currentTime !== -1 && this.duration !== undefined) && (
        <label>
          {formatTime(this.currentTime)} / {formatTime(this.duration)}
        </label>
      )
    );
  }
}
