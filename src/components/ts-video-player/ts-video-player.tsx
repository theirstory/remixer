import { Component, h, Prop, State, Watch } from "@stencil/core";
import { Clip } from "../../interfaces/clip";
import { getVideoUrl } from "../../utils";
import { Clock } from "../../Clock";

@Component({
  tag: "ts-video-player",
  styleUrl: "ts-video-player.css",
  shadow: false
})
export class TSVideoPlayer {
  private _clock: Clock;
  private _clipsMap: Map<number, HTMLVideoElement> = new Map<number, HTMLVideoElement>();

  @Prop() clips: Clip[];
  @Watch("clips")
  async watchClips() {
    this._clipsChanged();
  }

  @State() isPlaying: boolean = false;
  @State() allClipsReady: boolean = false;

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
    video.currentTime = clip.start;
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
    this._clipsMap = new Map([...this._clipsMap].filter(([key]) => this.clips.find((clip: Clip) => {
      return clip.id === key;
    })));

    if (!this.clips.length) {
      this._stop();
    }
  }

  private _update(): void {

    console.log(this._clock.currentTime);

    if (!this.allClipsReady) {
      return;
    }

    let currentClip: Clip;

    this.clips.map((clip: Clip) => {
      clip.isCurrent = (clip.sequencedStart <= this._clock.currentTime && clip.sequencedEnd >= this._clock.currentTime);

      if (clip.isCurrent) {
        currentClip = clip;
      }
    });

    if (currentClip) {
      const video: HTMLVideoElement = this._clipsMap.get(currentClip.id);
      if (this.isPlaying) {
        video.play();
      } else {
        video.pause();
      }
    } else if (this.isPlaying && this._currentTimeExceedsClips()) {
      this._pause();
    }
  }

  private _currentTimeExceedsClips(): boolean {
    return this._clock.currentTime > this.clips[this.clips.length -1].sequencedEnd;
  }

  render() {
    return (
      <div>
        {this.clips.map((clip: Clip) => {
          return (
            <video
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
