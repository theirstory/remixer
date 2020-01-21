import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter, State } from "@stencil/core";
import { Clip } from "../../interfaces/Clip";
import { getRemixedVideoUrl, sequenceClips } from "../../utils";
import { Motivation, Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-editor",
  styleUrl: "editor.css",
  shadow: false
})
export class Editor {
  @Prop({ mutable: true }) clips: Clip[] = [];
  @Prop() remixing: boolean;
  @Prop() remixedVideo: string;

  @Event() reorderedClips: EventEmitter<Clip[]>;
  @Event() removedClip: EventEmitter<Clip>;
  @Event() save: EventEmitter<string>;

  private _videoPlayer: HTMLTsVideoPlayerElement;
  @State() private _highlightedClip: Clip | null = null;

  get sequencedClips(): Clip[] {
    return sequenceClips(this.clips);
  }

  render() {
    return (
      <div>
        {this.clips.length > 0 && (
          <ts-video-player
            ref={el => (this._videoPlayer = el)}
            clips={this.clips}
            annotation-enabled={true}
            annotations={
              this._highlightedClip
                ? [
                    {
                      id: this._highlightedClip.id,
                      start: this._highlightedClip.sequencedStart,
                      end: this._highlightedClip.sequencedEnd,
                      motivation: Motivation.HIGHLIGHTING
                    } as Annotation
                  ]
                : null
            }
          ></ts-video-player>
        )}
        <ts-annotation-editor
          annotations={this.sequencedClips}
          onAnnotationMouseOver={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            this._highlightedClip = e.detail;
          }}
          onAnnotationMouseOut={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            this._highlightedClip = null;
          }}
          onAnnotationClick={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            const clip: Clip = e.detail;
            this._videoPlayer.setCurrentTime(clip.sequencedStart);
          }}
          onDeleteAnnotation={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            this.removedClip.emit(e.detail);
          }}
          onReorderedAnnotations={(e: CustomEvent<Annotation[]>) => {
            e.stopPropagation();
            this.clips = e.detail as Clip[];
          }}
        ></ts-annotation-editor>
        {this.sequencedClips.length > 0 && (
          <div>
            <ion-button
              size="small"
              disabled={!this.remixedVideo || this.remixing}
              onClick={() => {
                window.open(getRemixedVideoUrl(this.remixedVideo).href);
              }}
            >
              <ion-icon name="download"></ion-icon>
            </ion-button>
            <ion-button
              size="small"
              disabled={!this.remixedVideo || this.remixing}
              onClick={() => {
                this.save.emit(JSON.stringify(this.clips));
              }}
            >
              <ion-icon name="save"></ion-icon>
            </ion-button>
          </div>
        )}
      </div>
    );
  }
}
