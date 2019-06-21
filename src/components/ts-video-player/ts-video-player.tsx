import { Component, h, Prop, State, Watch, Listen } from "@stencil/core";
import { Clip } from "../../interfaces/clip";
import { getVideoUrl, sequenceClips } from "../../utils";
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

  @Prop() clips: Clip[] = [];
  @Watch("clips")
  async watchClips() {
    this._clipsChanged();
  }

  @Prop() clipSelectionEnabled: boolean = false;

  @State() sequencedClips: Clip[] = [];
  @State() allClipsReady: boolean = false;
  @State() currentTime: number = 0;

  componentDidLoad(): void {
    this._clock = new Clock(() => {
      this._update();
    });
    this._clipsChanged();
  }

  private _clipsChanged(): void {
    // remove unused items from map
    this._clipsMap = new Map(
      [...this._clipsMap].filter(([key]) =>
        this.clips.find((clip: Clip) => {
          return clip.id === key;
        })
      )
    );

    this.sequencedClips = this.clips;
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

    if (isNaN(clip.id)) {
      clip.id = new Date().getTime();
    }

    if (isNaN(clip.start)) {
      clip.start = 0;
    }

    video.currentTime = clip.start; // needed so that videos default to the correct frame before being played

    this._clipsMap.set(clip.id, video);

    // check if all videos are loaded yet
    let allReady: boolean = true;

    this.sequencedClips.forEach((clip: Clip) => {
      // if any of the remaining clips haven't
      // been entered into clipMap yet
      if (!this._clipsMap.get(clip.id)) {
        allReady = false;
      }
    });

    if (allReady) {
      // now that we have a loaded video for each clip,
      // if clip.end hasn't been set, use video.duration.
      for (let i = 0; i < this.sequencedClips.length; i++) {
        const clip: Clip = this.sequencedClips[i];
        if (isNaN(clip.end)) {
          const video: HTMLVideoElement = this._clipsMap.get(clip.id);
          if (video) {
            clip.end = video.duration;
          }
        }
      }

      // sequence clips
      this.sequencedClips = sequenceClips(this.sequencedClips);
    }

    this.allClipsReady = allReady;
  };

  // called every tick by the clock
  // all state is updated here. between this and render we essentially have a regular game loop.
  private _update(): void {
    //console.log(this._clock.currentTime);

    if (!this.allClipsReady) {
      return;
    }

    if (!this.sequencedClips.length) {
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
      //console.log("synced video");
    }
  }

  private _getClipByTime(time: number): Clip | null {
    let currentClip: Clip | null = null;

    for (let i = 0; i < this.sequencedClips.length; i++) {
      const clip: Clip = this.sequencedClips[i];

      if (clip.sequencedStart <= time && clip.sequencedEnd >= time) {
        currentClip = clip;
        break;
      }
    }

    return currentClip;
  }

  render() {
    return (
      <div>
        {this.sequencedClips.map((clip: Clip) => {
          const videoClasses = classNames({
            hide:
              (this._currentClip && this._currentClip.id !== clip.id) ||
              (!this._currentClip && this.sequencedClips.indexOf(clip) !== 0)
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
        <ts-video-controls
          pin={false}
          disabled={!this.allClipsReady || !this.sequencedClips.length}
          duration={
            this.sequencedClips.length
              ? this.sequencedClips[this.sequencedClips.length - 1].sequencedEnd
              : 0
          }
          currentTime={this._clock ? this._clock.currentTime : 0}
          clockIsTicking={this._clock && this._clock.isTicking}
          clipSelectionEnabled={this.clipSelectionEnabled}
        />
      </div>
    );
  }

  @Listen("scrubStart")
  onScrubStart(e: CustomEvent) {
    this._pause();
    this._clock.setCurrentTime(e.detail);
  }

  @Listen("scrub")
  onScrub(e: CustomEvent) {
    this._clock.setCurrentTime(e.detail);
  }

  @Listen("scrubEnd")
  onScrubEnd(e: CustomEvent) {
    this._clock.setCurrentTime(e.detail);
  }

  @Listen("play")
  onPlay() {
    this._play();
  }

  @Listen("pause")
  onPause() {
    this._pause();
  }
}
