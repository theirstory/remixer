import { Component, Prop, h, State, Method } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import {
  appClearAnnotations,
  appDeleteAnnotation,
  appRemixMedia,
  appReorderAnnotations,
  appSetAnnotation,
  appSetAnnotationMotivation,
  appSetSelectedAnnotation,
  appSetSelectedMedia
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import { Annotation, Motivation, AnnotationMap, AnnotationTuple } from "../../interfaces/Annotation";
import { getNextAnnotationId, diff } from "../../utils";
import { SequencedDurationKeys } from "../../interfaces/SequencedDuration";
import { Data } from "../../interfaces/Data";

@Component({
  tag: "ts-remixer",
  styleUrl: "remixer.css",
  shadow: true
})
export class Remixer {
  @Prop({ context: "store" }) store: Store;
  @Prop() debugConsoleEnabled: boolean = false;

  //#region actions
  appClearAnnotations: Action;
  appDeleteAnnotation: Action;
  appRemixMedia: Action;
  appReorderAnnotations: Action;
  appSetAnnotation: Action;
  appSetAnnotationMotivation: Action;
  appSetSelectedAnnotation: Action;
  appSetSelectedMedia: Action;
  //#endregion

  //#region state
  @State() annotations: Map<string, Annotation>;
  @State() annotationMotivation: Motivation;
  @State() remixedMedia: string | null;
  @State() remixing: boolean;
  @State() selectedAnnotation: string | null;
  @State() selectedMedia: string | null;
  //#endregion

  //#region methods
  @Method() setData(data: Data) {
    this.appClearAnnotations();
    const annotations: AnnotationMap = new Map(data.annotations);
    annotations.forEach((value: Annotation, key: string) => {
      this.appSetAnnotation([key, value]);
    });
  }
  //#endregion

  componentWillLoad() {
    // redux
    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: { annotations, annotationMotivation, remixedMedia, remixing, selectedAnnotation, selectedMedia }
      } = state;

      return {
        annotations,
        annotationMotivation,
        remixedMedia,
        remixing,
        selectedAnnotation,
        selectedMedia
      };
    });

    this.store.mapDispatchToProps(this, {
      appClearAnnotations,
      appDeleteAnnotation,
      appRemixMedia,
      appReorderAnnotations,
      appSetAnnotation,
      appSetAnnotationMotivation,
      appSetSelectedAnnotation,
      appSetSelectedMedia
    });
  }

  render() {

    const selectedAnnotation: AnnotationTuple | null = this.selectedAnnotation ? [this.selectedAnnotation, this.annotations.get(this.selectedAnnotation)] : null;

    return (
      <div id="remixer">
        <div class="col">
          <ts-archive-room
            onMediaSelected={(e: CustomEvent<string>) => {
              this.appSetSelectedMedia(e.detail);
            }}
          ></ts-archive-room>
        </div>
        <div class="col">
          <ts-cutting-room
            media={this.selectedMedia}
            onEdit={(e: CustomEvent<Annotation>) => {
              this.appSetAnnotation([getNextAnnotationId(), {
                ...e.detail,
                motivation: Motivation.EDITING
              }]);
              this.appRemixMedia();
            }}
          ></ts-cutting-room>
        </div>
        <div class="col">
          <ts-editing-room
            debugConsoleEnabled={this.debugConsoleEnabled}
            remixing={this.remixing}
            selectedAnnotation={selectedAnnotation}
            remixed-media={this.remixedMedia}
            annotations={this.annotations}
            annotation-motivation={this.annotationMotivation}
            onSetAnnotation={(e: CustomEvent<AnnotationTuple>) => {
              // get the current annotation
              const currentAnnotation: Annotation = this.annotations.get(e.detail[0]);

              this.appSetAnnotation(e.detail);

              const updatedAnnotation: Annotation = e.detail[1];

              if (updatedAnnotation.motivation === Motivation.EDITING) {
                // if it's an edit, and something effecting its body has changed
                // do a remix. otherwise it's placing unnecessary strain on the server.
                // there will already be a currentAnnotation as it was picked from the cutting room.
                const changes: string[] = diff<Annotation>(e.detail[1], currentAnnotation);

                if (this.annotationMotivation === Motivation.EDITING &&
                  changes.includes(SequencedDurationKeys.START) ||
                  changes.includes(SequencedDurationKeys.END) ||
                  changes.includes(SequencedDurationKeys.SEQUENCED_START) ||
                  changes.includes(SequencedDurationKeys.SEQUENCED_START)) {
                  this.appRemixMedia();
                }
              }
            }}
            onDeleteAnnotation={(e: CustomEvent<string>) => {
              this.appDeleteAnnotation(e.detail);
              if (this.annotationMotivation === Motivation.EDITING) {
                this.appRemixMedia();
              }
            }}
            onSelectAnnotation={(e: CustomEvent<string>) => {
              this.appSetSelectedAnnotation(e.detail);
            }}
            onSelectAnnotationMotivation={(e: CustomEvent<Motivation>) => {
              this.appSetAnnotationMotivation(e.detail);
            }}
            onReorderAnnotations={(e: CustomEvent<AnnotationMap>) => {
              this.appReorderAnnotations(e.detail);
              if (this.annotationMotivation === Motivation.EDITING) {
                this.appRemixMedia();
              }
            }}
          ></ts-editing-room>
          {/* <br/>
          <span>selectedAnnotation:&nbsp;</span>{this.selectedAnnotation || "none"}<br/>
          <span>selectedMedia:&nbsp;</span>{this.selectedMedia}<br/>
          <span>annotationMotivation:&nbsp;</span>{this.annotationMotivation}<br/>
          <span>remixing:&nbsp;</span>{this.remixing ? "true" : "false"}<br/> */}
        </div>
      </div>
    );
  }
}
