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
import {
  getMediaUrl,
  sequenceAnnotations
} from "../../utils";
import { Clock } from "../../Clock";
import { TimelineChangeEventDetail } from "../timeline/interfaces";
import { Annotation, AnnotationTuple, AnnotationMap } from "../../interfaces/Annotation";
import { SequencedDuration } from "../../interfaces/SequencedDuration";

@Component({
  tag: "ts-media-player",
  styleUrl: "media-player.css",
  shadow: false
})
export class MediaPlayer {
  private _clock: Clock;
  private _clipsReady: Map<string, boolean> = new Map<string, boolean>();

  private _mediaSyncMarginSecs: number = 0.5;
  private _currentClip: AnnotationTuple;
  private _lastClip: AnnotationTuple;
  private _playPromise: Promise<void>;

  @Prop() annotations: AnnotationMap = new Map<string, Annotation>();
  @Watch("annotations")
  async watchAnnotations() {
    this._annotationsChanged();
  }

  @Prop() annotationEnabled: boolean = false;
  @Prop({ mutable: true }) highlights: AnnotationMap | null = null;

  @Prop({ mutable: true }) selected: Annotation | null = null;
  @Watch("selected")
  async watchSelected(newValue: Annotation | null, oldValue: Annotation | null) {
    console.log("watch selected", newValue, oldValue);
    if (newValue && oldValue && newValue.sequencedStart !== oldValue.sequencedStart) {
      this.setCurrentTime(newValue.sequencedStart);
    }
  }

  @State() private _currentTime: number = 0;
  @State() private _sequencedClips: AnnotationMap = new Map<string, Annotation>();
  @State() private _allClipsReady: boolean;

  @Element() el: HTMLElement;

  @Event() annotation: EventEmitter<Annotation>;
  @Event() annotationSelectionChange: EventEmitter<Annotation>;

  @Method() setCurrentTime(currentTime: number) {
    this.pause();
    this._clock.setCurrentTime(currentTime);
  }

  componentWillLoad(): void {
    this._clock = new Clock(() => {
      this._update();
    });
    this._annotationsChanged();
  }

  private _annotationsChanged(): void {
    this.stop();

    // check all clips have a unique id
    // const ids: string[] = Array.from(this.annotations).map(annotation => {
    //   const [key] = annotation;
    //   return key;
    // });

    // const hasDuplicate: boolean = ids.some((item, index) => {
    //   return ids.indexOf(item) !== index;
    // });

    // if (hasDuplicate) {
    //   throw new Error("passed annotations with duplicate ids");
    // }

    console.log("annotations changed");

    // remove unused items from map
    this._clipsReady = new Map(
      Array.from(this._clipsReady).filter(([key]) =>
        Array.from(this.annotations).find(annotation => {
          const [id] = annotation;
          return id === key;
        })
      )
    );

    // if currentClip and lastClip no longer exist in map, set them to null
    if (this._currentClip && !this._clipsReady.get(this._currentClip[0])) {
      this._currentClip = null;
    }

    if (this._lastClip && !this._clipsReady.get(this._lastClip[0])) {
      this._lastClip = null;
    }

    // because the clips are cloned and sequenced inside the video player,
    // if one is deleted outside of the video player, it will lose its sequenceStart/End
    // therefore we need to resequence everything when the clips change
    // this also triggers a render
    this._sequencedClips = sequenceAnnotations(this.annotations);
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
    const clip: AnnotationTuple = video["data-clip"];

    video.currentTime = clip[1].start; // needed so that videos default to the correct frame before being played

    this._clipsReady.set(clip[0], true);

    // check if all videos are loaded yet
    let allReady: boolean = true;

    this._sequencedClips.forEach((_clip: Annotation, key: string) => {
      // if any of the remaining clips haven't
      // been entered into clipMap yet
      if (!this._clipsReady.get(key)) {
        allReady = false;
      }
    });

    if (allReady) {
      // now that we have a loaded video for each clip,
      // if clip.end hasn't been set, use video.duration.
      this._sequencedClips.forEach((clip: Annotation, key: string) => {
        if (isNaN(clip.end)) {
          const video: HTMLVideoElement = this._getVideoByClipId(key);
          if (video) {
            clip.end = video.duration;
          }
        }
      });

      // we need to sequence clips again here as they may not have had
      // a start or end before it being calculated on load.
      // e.g. when using media-player to play a single clip with only
      // a source specified.
      this._sequencedClips = sequenceAnnotations(this._sequencedClips);
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

    if (!this._sequencedClips.size) {
      this.stop();
    }

    this._currentClip = this._getClipByTime(this._currentTime);

    if (this._currentClip) {
      // if the current clip has changed, reset the last clip
      if (this._lastClip && this._currentClip[0] !== this._lastClip[0]) {
        this._resetVideo(this._lastClip);
      }

      const video: HTMLVideoElement = this._getVideoByClipId(this._currentClip[0]);

      if (this._clock.isTicking) {
        if (video && video.paused) {
          this._playPromise = video.play();
        }
        this._syncToClock(video, this._currentClip[1]);
      } else if (video) {
        if (!video.paused) {
          await this._playPromise;
          video.pause();
        } else {
          video.currentTime = this._getClipSequencedTime(this._currentClip[1]);
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

  private _resetVideo(clip: AnnotationTuple): void {
    const video: HTMLVideoElement = this._getVideoByClipId(clip[0]);
    if (video && !video.paused) {
      video.pause();
      video.currentTime = clip[1].start;
    }
  }

  private _getVideoByClipId(clipId: string): HTMLVideoElement {
    let video: HTMLVideoElement;
    video = this.el.querySelector("#" + clipId);

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

  private _getClipByTime(time: number): AnnotationTuple | null {
    let currentClip: AnnotationTuple | null = null;

    for (const [key, clip] of this._sequencedClips.entries()) {
      if (clip.sequencedStart <= time && clip.sequencedEnd >= time) {
        currentClip = [key, clip];
        break;
      }
    }

    return currentClip;
  }

  private _getTarget(): string | null {
    let target: string | null = null;

    if (this._currentClip) {
      target = this._currentClip[1].target;
    } else {
      if (this.annotations.size) {
        target = Array.from(this.annotations)[0][1].target;
      }
    }

    return target;
  }

  render() {

    let duration: number;

    if (this._sequencedClips.size) {
      duration = Array.from(this._sequencedClips)[this._sequencedClips.size -1][1].sequencedEnd;
    }

    return (
      <div class="media-player">
        {Array.from(this._sequencedClips).map(value => {
          const [key, clip] = value;
          return (
            <video
              id={key}
              class={{
                clip: true,
                hide:
                  (this._currentClip && this._currentClip[0] !== key) ||
                  (!this._currentClip && Array.from(this._sequencedClips).findIndex(item => item[0] === key) !== 0)
              }}
              src={getMediaUrl(clip.target).href}
              data-clip={value}
              onLoadedMetaData={this._clipLoaded}
            />
          );
        })}
        <ts-media-controls
          selected={this.selected}
          disabled={!this._allClipsReady || !this._sequencedClips.size}
          duration={duration|| 0}
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
          onAnnotation={(e: CustomEvent<SequencedDuration>) => {
            e.stopPropagation();
            this.annotation.emit({
              ...e.detail,
              target: this._getTarget()
            });
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
