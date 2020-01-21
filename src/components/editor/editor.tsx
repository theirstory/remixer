import "@ionic/core";
import { Component, Prop, h, Event, EventEmitter, State } from "@stencil/core";
import { getRemixedVideoUrl, sequenceClips } from "../../utils";
import { Motivation, Annotation } from "../../interfaces/Annotation";

@Component({
  tag: "ts-editor",
  styleUrl: "editor.css",
  shadow: false
})
export class Editor {
  @Prop({ mutable: true }) clips: Annotation[] = [];
  @Prop() remixing: boolean;
  @Prop() remixedVideo: string;

  @Event() updatedClip: EventEmitter<Annotation>;
  @Event() reorderedClips: EventEmitter<Annotation[]>;
  @Event() removedClip: EventEmitter<Annotation>;
  @Event() save: EventEmitter<string>;

  private _videoPlayer: HTMLTsVideoPlayerElement;
  @State() private _highlightedAnnotation: Annotation | null = null;

  get sequencedClips(): Annotation[] {
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
            highlights={
              this._highlightedAnnotation
                ? [
                    {
                      id: this._highlightedAnnotation.id,
                      start: this._highlightedAnnotation.sequencedStart,
                      end: this._highlightedAnnotation.sequencedEnd,
                      motivation: Motivation.HIGHLIGHTING
                    }
                  ]
                : null
            }
            onAnnotationSelectionChange={(e: CustomEvent<Annotation>) => {
              e.stopPropagation();
              this.updatedClip.emit(e.detail);
            }}
          ></ts-video-player>
        )}
        <ts-annotation-editor
          annotations={this.sequencedClips}
          onAnnotationMouseOver={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            this._highlightedAnnotation = e.detail;
          }}
          onAnnotationMouseOut={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            this._highlightedAnnotation = null;
          }}
          onAnnotationClick={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            this._videoPlayer.selectAnnotation(e.detail);
          }}
          onDeleteAnnotation={(e: CustomEvent<Annotation>) => {
            e.stopPropagation();
            this.removedClip.emit(e.detail);
          }}
          onReorderedAnnotations={(e: CustomEvent<Annotation[]>) => {
            e.stopPropagation();
            this.reorderedClips.emit(e.detail);
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
