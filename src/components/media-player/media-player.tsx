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
  sequenceClips,
  compareMapKeys
} from "../../utils";
import { Clock } from "../../Clock";
import { TimelineChangeEventDetail } from "../timeline/interfaces";
import { Annotation, AnnotationTuple, AnnotationMap, Motivation } from "../../interfaces/Annotation";
import { HTMLStencilElement } from "@stencil/core/internal";
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
  private _selectionOriginatedInternally: boolean = false;

  @Prop() clips: AnnotationMap = new Map<string, Annotation>();
  @Watch("clips")
  async watchClips() {
    this._clipsChanged();
  }

  @Prop() annotationEnabled: boolean = false;
  @Prop() annotationMotivation: Motivation = Motivation.NONE;
  @Prop({ mutable: true }) highlights: AnnotationMap | null = null;

  @Prop() selected: Annotation | null = null;
  @Watch("selected")
  async watchSelected(newValue: Annotation | null, _oldValue: Annotation | null) {

    if (this.movePlayheadOnSelect && !this._selectionOriginatedInternally && newValue !== null) {
      if (newValue.sequencedStart !== undefined) {
        this._setCurrentTime(newValue.sequencedStart);
      } else {
        this._setCurrentTime(newValue.start);
      }
    }

    this._selectionOriginatedInternally = false;
  }

  @Prop() movePlayheadOnSelect: boolean = false;

  @State() private _currentTime: number = 0;
  @State() private _sequencedClips: AnnotationMap = new Map<string, Annotation>();

  @State() private _allClipsReady: boolean;
  @Watch("_allClipsReady")
  async watchAllClipsReady(ready: boolean) {
    // it's necessary to give the media-controls a "kick" in order for the playhead to be reset
    if (!ready) {
      this._clock.setCurrentTime(-1);
    } else {
      this._clock.setCurrentTime(0);
    }
  }

  @Element() el: HTMLStencilElement;

  @Event() annotation: EventEmitter<Annotation>;
  @Event() annotationSelectionChange: EventEmitter<Annotation>;

  @Method()
  public play() {
    this._clock.play();
  }

  @Method()
  public pause() {
    this._clock.pause();
  }

  @Method()
  public stop() {
    this._clock.stop();
  }

  componentWillLoad(): void {
    this._clock = new Clock(() => {
      this._update();
    });
    this._clipsChanged();
  }

  private _clipsChanged(): void {

    // remove unused items from map
    this._clipsReady = new Map(
      Array.from(this._clipsReady).filter(([key]) =>
        Array.from(this.clips).find(annotation => {
          return annotation[0] === key;
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

    this._sequencedClips = sequenceClips(this.clips);

    this._allClipsReady = compareMapKeys(this._sequencedClips, this._clipsReady);
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
          const video: HTMLVideoElement = this._getVideoByClip(key);
          if (video) {
            clip.end = video.duration;
          }
        }
      });

      // we need to sequence clips again here as they may not have had
      // a start or end before it being calculated on load.
      // e.g. when using media-player to play a single clip with only
      // a source specified.
      this._sequencedClips = sequenceClips(this._sequencedClips);
    }

    this._allClipsReady = allReady;
  };

  private _setCurrentTime(currentTime: number) {
    this.pause();
    this._clock.setCurrentTime(currentTime);
  }

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

      const video: HTMLVideoElement = this._getVideoByClip(this._currentClip[0]);

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
          const clipSequencedTime: number = this._getClipSequencedTime(this._currentClip[1]);
          video.currentTime = clipSequencedTime;
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

    let video: HTMLVideoElement;

    video = this._getVideoByClip(clip[0]);
    if (video && !video.paused) {
      video.pause();
      video.currentTime = clip[1].start;
    }
  }

  private _getVideoByClip(clipId: string): HTMLVideoElement {
    let video: HTMLVideoElement;

    video = this.el.querySelector("#" + clipId);

    if (!video) {
      video = this.el.querySelector(".clip");
    }

    return video;
  }

  private _getClipSequencedTime(clip: Annotation): number {
    const currentTime: number = this._clock.currentTime + clip.start - clip.sequencedStart;
    return currentTime;
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

  private get body(): string | null {
    let body: string | null = null;

    if (this._currentClip) {
      body = this._currentClip[1].body;
    } else {
      if (this.clips.size) {
        body = Array.from(this.clips)[0][1].body;
      }
    }

    return body;
  }

  private get duration(): number {
    if (this._sequencedClips.size) {
      return Array.from(this._sequencedClips)[this._sequencedClips.size -1][1].sequencedEnd;
    }

    return 0;
  }

  private get bodyDuration(): number {
    if (this._sequencedClips.size) {
      const annotation: AnnotationTuple = Array.from(this._sequencedClips).find(clip => {
        return clip[1].body === this.body;
      });

      if (annotation) {
        return annotation[1].end;
      }
    }

    return 0;
  }

  render() {

    const currentTime: number = this._clock ? this._clock.currentTime : 0;

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
              src={getMediaUrl(clip.body).href}
              data-clip={value}
              onLoadedMetaData={this._clipLoaded}
            />
          );
        })}
        <ts-media-controls
          selected={this.selected}
          disabled={!this._allClipsReady}
          duration={this.duration}
          currentTime={currentTime}
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

            this._selectionOriginatedInternally = true;

            let body: string;
            let bodyDuration: number;
            let targetDuration: number = this.duration;

            if (this.annotationMotivation === Motivation.EDITING) {
              if (this.selected) {
                body = this.selected.body;
                bodyDuration = this.selected.bodyDuration;
              } else {
                body = this.body;
                bodyDuration = this.bodyDuration;
              }

              this.annotation.emit({
                ...e.detail,
                body: body,
                bodyDuration: bodyDuration,
                targetDuration: targetDuration
              });
            } else {
              // we're not annotating a media body - it's a bookmark, comment, or some other textual body to be set outside the media player
              this.annotation.emit({
                ...e.detail,
                targetDuration: targetDuration
              });
            }
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
