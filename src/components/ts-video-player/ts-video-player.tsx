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
  private _mediaSyncMarginSecs: number = 0.5;

  @Prop() clips: Clip[];
  @Watch("clips")
  async watchClips() {
    this._clipsChanged();
  }

  @State() isPlaying: boolean = false;
  @State() allClipsReady: boolean = false;
  @State() currentClip: Clip | null = null;

  componentDidLoad(): void {
    this._clock = new Clock(() => {
      this._update();
    });
  }

  private _play(): void {
    // if we're at the end of the video, play from the beginning
    if (this._currentTimeExceedsClips()) {
      this._stop();
    }
    this._clock.play();
    this.isPlaying = true;
  }

  private _pause(): void {
    this._clock.pause();
    this.isPlaying = false;
    this._update();
  }

  private _stop(): void {
    this._clock.stop();
    this.isPlaying = false;
    this._update();
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

    if (!this.clips.length) {
      this._stop();
    }
  }

  // called every tick by the clock
  private _update(): void {
    console.log(this._clock.currentTime);

    if (!this.allClipsReady) {
      return;
    }

    this.currentClip = this._getCurrentClip();

    // need a way to convert between absolute time (0 - last clip.sequencedEnd)
    // and a point in a given video

    if (this.currentClip) {
      const video: HTMLVideoElement = this._clipsMap.get(this.currentClip.id);
      if (this.isPlaying) {
        if (!video.playing) {
          video.play();
        }
        this._syncToClock(video, this.currentClip);
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    } else if (this.isPlaying && this._currentTimeExceedsClips()) {
      this._pause();
    }
  }

  // we're using the whole video duration in each video tag, but only
  // want to play a given section of it (the clip).
  // if the video's current position is outside an acceptable margin
  // re-sync it.
  private _syncToClock(video: HTMLVideoElement, clip: Clip): void {

    const correctTime: number = (this._clock.currentTime + clip.start - clip.sequencedStart);
    const actualTime: number = video.currentTime;

    if (Math.abs(actualTime - correctTime) > this._mediaSyncMarginSecs) {
      video.currentTime = correctTime;
      console.log("synced video");
    }
  }

  private _getCurrentClip(): Clip | null {

    let currentClip: Clip | null = null;

    for (let i = 0; i < this.clips.length; i++) {
      const clip: Clip = this.clips[i];

      if (
        clip.sequencedStart <= this._clock.currentTime &&
        clip.sequencedEnd >= this._clock.currentTime
      ) {
        currentClip = clip;
        break;
      }
    }

    return currentClip;
  }

  private _currentTimeExceedsClips(): boolean {
    return (
      this._clock.currentTime > this.clips[this.clips.length - 1].sequencedEnd
    );
  }

  render() {
    return (
      <div>
        {this.clips.map((clip: Clip) => {

          const videoClasses = classNames({
            hide: (this.currentClip && this.currentClip.id !== clip.id)
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
              this.isPlaying ? this._pause() : this._play();
            }
          }}
        >
          {this.isPlaying ? "Pause" : "Play"}
        </ion-button>
      </div>
    );
  }
}