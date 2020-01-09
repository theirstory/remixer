import { Component, Element, h, Prop, State, Watch } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";
import { getVideoUrl, sequenceClips, getNextClipId } from "../../utils";
import { Clock } from "../../Clock";
import classNames from "classnames";
import { TimelineChangeEventDetail } from "../timeline/interfaces";
import { ClipChangeEventDetail } from "../video-controls/interfaces";

@Component({
  tag: "ts-video-player",
  styleUrl: "video-player.css",
  shadow: false
})
export class TSVideoPlayer {
  private _clock: Clock;
  private _clipsReady: Map<string, boolean> = new Map<
    string,
    boolean
  >();

  private _mediaSyncMarginSecs: number = 0.5;
  private _currentClip: Clip;
  private _lastClip: Clip;
  private _playPromise: Promise<void>;

  @Prop() clips: Clip[] = [];
  @Watch("clips")
  async watchClips() {
    this._clipsChanged();
  }

  @Prop() clipSelectionEnabled: boolean = false;

  @State() sequencedClips: Clip[] = [];
  @State() allClipsReady: boolean;
  @State() currentTime: number = 0;

  @Element() el: HTMLElement;

  componentWillLoad(): void {
    this._clock = new Clock(() => {
      this._update();
    });
    this._clipsChanged();
  }

  private _clipsChanged(): void {
    this._stop();

    // remove unused items from map
    this._clipsReady = new Map(
      [...this._clipsReady].filter(([key]) =>
        this.clips.find((clip: Clip) => {
          return clip.id === key;
        })
      )
    );

    // if currentClip and lastClip no longer exist in map, set them to null
    if (this._currentClip && !this._clipsReady.get(this._currentClip.id)) {
      this._currentClip = null;
    }

    if (this._lastClip && !this._clipsReady.get(this._lastClip.id)) {
      this._lastClip = null;
    }

    // because the clips are cloned and sequenced inside the video player,
    // if one is deleted outside of the video player, it will lose its sequenceStart/End
    // therefore we need to resequence everything when the clips change
    // this also triggers a render
    this.sequencedClips = sequenceClips(this.clips);
  }

  private _play(): void {
    this._clock.play();
  }

  private _pause(): void {
    this._clock.pause();
  }

  private _stop(): void {
    this._clock.stop();
  }

  private _clipLoaded = event => {
    const video: HTMLVideoElement = event.currentTarget;
    const clip: Clip = video["data-clip"];

    if (!clip.id) {
      clip.id = getNextClipId();
    }

    if (isNaN(clip.start)) {
      clip.start = 0;
    }

    video.currentTime = clip.start; // needed so that videos default to the correct frame before being played

    this._clipsReady.set(clip.id, true);

    // check if all videos are loaded yet
    let allReady: boolean = true;

    this.sequencedClips.forEach((clip: Clip) => {
      // if any of the remaining clips haven't
      // been entered into clipMap yet
      if (!this._clipsReady.get(clip.id)) {
        allReady = false;
      }
    });

    if (allReady) {
      // now that we have a loaded video for each clip,
      // if clip.end hasn't been set, use video.duration.
      for (let i = 0; i < this.sequencedClips.length; i++) {
        const clip: Clip = this.sequencedClips[i];
        if (isNaN(clip.end)) {
          const video: HTMLVideoElement = this._getVideoByClip(clip);
          if (video) {
            clip.end = video.duration;
          }
        }
      }

      // we need to sequence clips again here as they may not have had
      // a start or end before it being calculated on load.
      // e.g. when using video-player to play a single clip with only
      // a source specified.
      this.sequencedClips = sequenceClips(this.sequencedClips);
    }

    this.allClipsReady = allReady;
  };

  // called every tick by the clock, which then triggers render
  private async _update(): Promise<void> {
    //console.log(this._clock.currentTime);
    //console.log("update", this._clock.isTicking);

    if (!this.allClipsReady) {
      return;
    }

    if (!this._clipsReady.size) {
      this._stop();
    }

    if (!this.sequencedClips.length) {
      this._stop();
    }

    this._currentClip = this._getClipByTime(this.currentTime);

    if (this._currentClip) {
      // if the current clip has changed, reset the last clip
      if (this._currentClip !== this._lastClip) {
        if (this._lastClip) {
          this._resetVideo(this._lastClip);
        }
      }

      const video: HTMLVideoElement = this._getVideoByClip(this._currentClip);

      if (this._clock.isTicking) {
        if (video && video.paused) {
          this._playPromise = video.play();
        }
        this._syncToClock(video, this._currentClip);
      } else if (video) {
        if (!video.paused) {
          await this._playPromise;
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

    // update currentTime to trigger a render
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
    let video: HTMLVideoElement;
    video = this.el.querySelector("#" + clip.id);

    if (!video) {
      video = this.el.querySelector(".clip");
    }

    return video;
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

  private _getSource(): string | null {
    let source: string | null = null;

    if (this._currentClip) {
      source = this._currentClip.source;
    } else {
      if (this.clips.length) {
        source = this.clips[0].source;
      }
    }

    return source;
  }

  render() {
    return (
      <div>
        {this.sequencedClips.map((clip: Clip) => {
          const videoClasses = classNames({
            clip: true,
            hide:
              (this._currentClip && this._currentClip.id !== clip.id) ||
              (!this._currentClip && this.sequencedClips.indexOf(clip) !== 0)
          });

          return (
            <video
              id={clip.id ? clip.id : ""}
              class={videoClasses}
              src={getVideoUrl(clip.source).href}
              data-clip={clip}
              onLoadedMetaData={this._clipLoaded}
            />
          );
        })}
        <ts-video-controls
          disabled={!this.allClipsReady || !this.sequencedClips.length}
          duration={
            this.sequencedClips.length
              ? this.sequencedClips[this.sequencedClips.length - 1].sequencedEnd
              : 0
          }
          currentTime={this._clock ? this._clock.currentTime : 0}
          isPlaying={this._clock && this._clock.isTicking}
          clipSelectionEnabled={this.clipSelectionEnabled}
          ranges={
            [
              {
                id: "range1",
                start: 1,
                end: 3
              },
              {
                id: "range2",
                start: 5,
                end: 7
              }
            ]
          }
          onPlay={() => {
            this._play();
          }}
          onPause={() => {
            this._pause();
          }}
          onClipChanged={(e: CustomEvent<ClipChangeEventDetail>) => {
            e.detail.source = this._getSource();
          }}
          onClipSelected={(e: CustomEvent<ClipChangeEventDetail>) => {
            e.detail.source = this._getSource();
          }}
          onScrubStart={(e: CustomEvent<TimelineChangeEventDetail>) => {
            this._pause();
            this._clock.setCurrentTime(e.detail.currentTime);
          }}
          onScrub={(e: CustomEvent<TimelineChangeEventDetail>) => {
            this._clock.setCurrentTime(e.detail.currentTime);
          }}
          onScrubEnd={(e: CustomEvent<TimelineChangeEventDetail>) => {
            this._clock.setCurrentTime(e.detail.currentTime);
          }}
        />
      </div>
    );
  }
}