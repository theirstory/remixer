import { Component, h, Prop, State, Watch } from "@stencil/core";
import { Clip } from "../../interfaces/clip";
import { getVideoUrl } from "../../utils";
import { Clock } from "../../Clock";
import classNames from "classnames";

@Component({
  tag: "ts-video-player",
  styleUrl: "ts-video-player.css",
  shadow: false
})
export class TSVideoPlayer {
  private _clock: Clock;
  private _clipsMap: Map<number, HTMLVideoElement> = new Map<
    number,
    HTMLVideoElement
  >();

  private _currentClip: Clip;
  private _lastClip: Clip;
  private _mediaSyncMarginSecs: number = 0.5;
  private _scrubbing: boolean = false;
  private _scrubbingWhilePlaying: boolean = false;

  @Prop() clips: Clip[];
  @Watch("clips")
  async watchClips() {
    this._clipsChanged();
  }

  @State() allClipsReady: boolean = false;
  @State() currentTime: number = 0;

  componentDidLoad(): void {
    this._clock = new Clock(() => {
      this._update();
    });
  }

  private _play(): void {
    console.log("play");
    this._clock.play();
  }

  private _pause(): void {
    console.log("pause");
    this._clock.pause();
  }

  private _stop(): void {
    console.log("stop");
    this._clock.stop();
  }

  private _clipLoaded = event => {
    const video: HTMLVideoElement = event.currentTarget;
    const clip: Clip = video["data-clip"];
    this._clipsMap.set(clip.id, video);
    video.currentTime = clip.start; // needed so that videos default to the correct frame before being played
    let allReady: boolean = true;

    this.clips.forEach((clip: Clip) => {
      if (!this._clipsMap.get(clip.id)) {
        allReady = false;
      }
    });

    this.allClipsReady = allReady;
  };

  private _clipsChanged(): void {
    // remove unused items from map
    this._clipsMap = new Map(
      [...this._clipsMap].filter(([key]) =>
        this.clips.find((clip: Clip) => {
          return clip.id === key;
        })
      )
    );
  }

  // called every tick by the clock
  // all state is updated here. between this and render we essentially have a regular game loop.
  private _update(): void {

    //console.log(this._clock.currentTime);

    if (!this.allClipsReady) {
      return;
    }

    if (!this.clips.length) {
      this._stop();
    }

    this._currentClip = this._getClipByTime(this.currentTime);

    if (this._currentClip) {

      // if the current clip has changed, reset the last clip
      if (this._currentClip !== this._lastClip) {
        console.log("clip changed");
        if (this._lastClip) {
          this._resetVideo(this._lastClip);
        }
      }

      const video: HTMLVideoElement = this._getVideoByClip(this._currentClip);

      if (this._clock.isTicking) {
        if (video.paused) {
          video.play();
        }
        this._syncToClock(video, this._currentClip);
      } else {
        if (!video.paused) {
          video.pause();
        } else {
          video.currentTime = this._getClipSequencedTime(this._currentClip);
        }
      }
    } else if (this._clock.isTicking && this._lastClip) {
      this._resetVideo(this._lastClip);
      this._stop();
    }

    this._lastClip = this._currentClip;

    // update currentTime state to cause a render
    this.currentTime = this._clock.currentTime;
  }

  private _resetVideo(clip: Clip): void {
    const video: HTMLVideoElement = this._getVideoByClip(clip);
    if (video && !video.paused) {
      video.pause();
      video.currentTime = clip.start;
    }
  }

  private _getVideoByClip(clip: Clip): HTMLVideoElement {
    return this._clipsMap.get(clip.id);
  }

  private _getClipSequencedTime(clip: Clip): number {
    return this._clock.currentTime + clip.start - clip.sequencedStart;
  }

  // if the video's current position is outside an acceptable margin, re-sync it.
  private _syncToClock(video: HTMLVideoElement, clip: Clip): void {
    const correctTime: number = this._getClipSequencedTime(clip);
    const actualTime: number = video.currentTime;

    if (Math.abs(actualTime - correctTime) > this._mediaSyncMarginSecs) {
      video.currentTime = correctTime;
      console.log("synced video");
    }
  }

  private _getClipByTime(time: number): Clip | null {
    let currentClip: Clip | null = null;

    for (let i = 0; i < this.clips.length; i++) {
      const clip: Clip = this.clips[i];

      if (
        clip.sequencedStart <= time &&
        clip.sequencedEnd >= time
      ) {
        currentClip = clip;
        break;
      }
    }

    return currentClip;
  }

  private _scrubStart(e: number): void {
    if (this._clock.isTicking) {
      this._scrubbingWhilePlaying = true;
      this._pause();
    }

    this._scrubbing = true;
    this._clock.setCurrentTime(e);
  }

  private _scrub(e: number): void {
    if (this._scrubbing) {
      this._clock.setCurrentTime(e);
    }
  }

  private _scrubEnd(e: number): void {
    if (this._scrubbingWhilePlaying) {
      this._scrubbingWhilePlaying = false;
      this._play();
    }

    this._scrubbing = false;
    this._clock.setCurrentTime(e);
  }

  render() {
    return (
      <div>
        {this.clips.map((clip: Clip) => {
          const videoClasses = classNames({
            hide: (this._currentClip && this._currentClip.id !== clip.id || !this._currentClip && this.clips.indexOf(clip) !== 0)
          });

          return (
            <video
              class={videoClasses}
              src={getVideoUrl(clip.source).href}
              data-clip={clip}
              onLoadedMetaData={this._clipLoaded}
            />
          );
        })}
        <ion-button
          size="small"
          disabled={!this.allClipsReady || !this.clips.length}
          onClick={() => {
            {
              (this._clock && this._clock.isTicking) ? this._pause() : this._play();
            }
          }}
        >
          {
            [
              ((this._clock && this._clock.isTicking) && "Pause"),
              ((this._clock && !this._clock.isTicking && this._scrubbingWhilePlaying) && "Pause"),
              ((this._clock && !this._clock.isTicking && !this._scrubbingWhilePlaying) && "Play")
            ]
          }
        </ion-button>
        <ion-range
          disabled={!this.allClipsReady || !this.clips.length}
          pin="true"
          step="0.25"
          min="0"
          max={this.clips.length ? this.clips[this.clips.length - 1].sequencedEnd : 0}
          value={this._clock ? this._clock.currentTime : 0}
          onIonChange={e => this._scrub(e.detail.value)}
          onMouseDown={e => this._scrubStart(e.target.value)}
          onMouseUp={e => this._scrubEnd(e.target.value)}
        ></ion-range>
      </div>
    );
  }
}
