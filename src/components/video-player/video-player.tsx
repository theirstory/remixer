import {
  Component,
  Element,
  Event,
  h,
  Prop,
  State,
  Watch,
  EventEmitter,
  Method
} from "@stencil/core";
import { getVideoUrl, sequenceClips, getNextClipId } from "../../utils";
import { Clock } from "../../Clock";
import { TimelineChangeEventDetail } from "../timeline/interfaces";
import { Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-video-player",
  styleUrl: "video-player.css",
  shadow: false
})
export class VideoPlayer {
  private _clock: Clock;
  private _clipsReady: Map<string, boolean> = new Map<string, boolean>();

  private _mediaSyncMarginSecs: number = 0.5;
  private _currentClip: Annotation;
  private _lastClip: Annotation;
  private _playPromise: Promise<void>;

  @Prop() clips: Annotation[] = [];
  @Watch("clips")
  async watchClips() {
    this._clipsChanged();
  }

  @Prop() annotationEnabled: boolean = false;
  @Prop({ mutable: true }) highlights: Annotation[] | null = null;

  @State() private _currentTime: number = 0;
  @State() private _sequencedClips: Annotation[] = [];
  @State() private _allClipsReady: boolean;
  @State() private _selected: Annotation;

  @Element() el: HTMLElement;

  @Event() annotation: EventEmitter<Annotation>;

  @Method() setCurrentTime(currentTime: number) {
    this.pause();
    this._clock.setCurrentTime(currentTime);
  }

  @Method() selectAnnotation(annotation: Annotation) {
    this.setCurrentTime(annotation.sequencedStart);
    this._selected = annotation;
  }

  componentWillLoad(): void {
    this._clock = new Clock(() => {
      this._update();
    });
    this._clipsChanged();
  }

  private _clipsChanged(): void {
    this.stop();

    // check all clips have a unique id
    const ids: string[] = this.clips.map(clip => {
      return clip.id;
    })

    const hasDuplicate: boolean = ids.some((item, index) => {
      return ids.indexOf(item) !== index
    });

    if (hasDuplicate) {
      throw new Error("passed annotations with duplicate ids");
    }

    // remove unused items from map
    this._clipsReady = new Map(
      [...this._clipsReady].filter(([key]) =>
        this.clips.find((clip: Annotation) => {
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
    this._sequencedClips = sequenceClips(this.clips);
  }

  @Method()
  public play(): void {
    this._clock.play();
  }

  @Method()
  public pause(): void {
    this._clock.pause();
  }

  @Method()
  public stop(): void {
    this._clock.stop();
  }

  private _clipLoaded = event => {
    const video: HTMLVideoElement = event.currentTarget;
    const clip: Annotation = video["data-clip"];

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

    this._sequencedClips.forEach((clip: Annotation) => {
      // if any of the remaining clips haven't
      // been entered into clipMap yet
      if (!this._clipsReady.get(clip.id)) {
        allReady = false;
      }
    });

    if (allReady) {
      // now that we have a loaded video for each clip,
      // if clip.end hasn't been set, use video.duration.
      for (let i = 0; i < this._sequencedClips.length; i++) {
        const clip: Annotation = this._sequencedClips[i];
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
      this._sequencedClips = sequenceClips(this._sequencedClips);
    }

    this._allClipsReady = allReady;
  };

  // called every tick by the clock, which then triggers render
  private async _update(): Promise<void> {
    //console.log(this._clock.currentTime);
    //console.log("update", this._clock.isTicking);

    if (!this._allClipsReady) {
      return;
    }

    if (!this._clipsReady.size) {
      this.stop();
    }

    if (!this._sequencedClips.length) {
      this.stop();
    }

    this._currentClip = this._getClipByTime(this._currentTime);

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
      this.stop();
    }

    this._lastClip = this._currentClip;

    // update currentTime to trigger a render
    this._currentTime = this._clock.currentTime;
  }

  private _resetVideo(clip: Annotation): void {
    const video: HTMLVideoElement = this._getVideoByClip(clip);
    if (video && !video.paused) {
      video.pause();
      video.currentTime = clip.start;
    }
  }

  private _getVideoByClip(clip: Annotation): HTMLVideoElement {
    let video: HTMLVideoElement;
    video = this.el.querySelector("#" + clip.id);

    if (!video) {
      video = this.el.querySelector(".clip");
    }

    return video;
  }

  private _getClipSequencedTime(clip: Annotation): number {
    return this._clock.currentTime + clip.start - clip.sequencedStart;
  }

  // if the video's current position is outside an acceptable margin, re-sync it.
  private _syncToClock(video: HTMLVideoElement, clip: Annotation): void {
    const correctTime: number = this._getClipSequencedTime(clip);
    const actualTime: number = video.currentTime;

    if (Math.abs(actualTime - correctTime) > this._mediaSyncMarginSecs) {
      video.currentTime = correctTime;
      //console.log("synced video");
    }
  }

  private _getClipByTime(time: number): Annotation | null {
    let currentClip: Annotation | null = null;

    for (let i = 0; i < this._sequencedClips.length; i++) {
      const clip: Annotation = this._sequencedClips[i];

      if (clip.sequencedStart <= time && clip.sequencedEnd >= time) {
        currentClip = clip;
        break;
      }
    }

    return currentClip;
  }

  private _getTarget(): string | null {
    let target: string | null = null;

    if (this._currentClip) {
      target = this._currentClip.target;
    } else {
      if (this.clips.length) {
        target = this.clips[0].target;
      }
    }

    return target;
  }

  render() {
    return (
      <div class="video-player">
        {this._sequencedClips.map((clip: Annotation) => {
          return (
            <video
              id={clip.id ? clip.id : ""}
              class={{
                clip: true,
                hide:
                  (this._currentClip && this._currentClip.id !== clip.id) ||
                  (!this._currentClip && this._sequencedClips.indexOf(clip) !== 0)
              }}
              src={getVideoUrl(clip.target).href}
              data-clip={clip}
              onLoadedMetaData={this._clipLoaded}
            />
          );
        })}
        <ts-video-controls
          selected={this._selected}
          disabled={!this._allClipsReady || !this._sequencedClips.length}
          duration={
            this._sequencedClips.length
              ? this._sequencedClips[this._sequencedClips.length - 1]
                  .sequencedEnd
              : 0
          }
          currentTime={this._clock ? this._clock.currentTime : 0}
          isPlaying={this._clock && this._clock.isTicking}
          annotationEnabled={this.annotationEnabled}
          highlights={this.highlights}
          onPlay={(e: CustomEvent) => {
            e.stopPropagation();
            this.play();
          }}
          onPause={(e: CustomEvent) => {
            e.stopPropagation();
            this.pause();
          }}
          onAnnotation={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            e.detail.target = this._getTarget();
            this.annotation.emit(e.detail);
          }}
          onScrubStart={(e: CustomEvent<TimelineChangeEventDetail>) => {
            e.stopPropagation();
            this.pause();
            this._clock.setCurrentTime(e.detail.currentTime);
          }}
          onScrub={(e: CustomEvent<TimelineChangeEventDetail>) => {
            e.stopPropagation();
            this._clock.setCurrentTime(e.detail.currentTime);
          }}
          onScrubEnd={(e: CustomEvent<TimelineChangeEventDetail>) => {
            e.stopPropagation();
            this._clock.setCurrentTime(e.detail.currentTime);
          }}
        />
      </div>
    );
  }
}
