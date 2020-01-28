import { Component, Prop, h, State } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import {
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
import { getNextAnnotationId } from "../../utils";

@Component({
  tag: "ts-remixer",
  styleUrl: "remixer.css",
  shadow: true
})
export class Remixer {
  @Prop({ context: "store" }) store: Store;

  //#region actions
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
          <ts-media-list
            onMediaSelected={(e: CustomEvent<string>) => {
              this.appSetSelectedMedia(e.detail);
            }}
          ></ts-media-list>
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
          <ts-editor
            remixing={this.remixing}
            selectedAnnotation={selectedAnnotation}
            remixed-media={this.remixedMedia}
            annotations={this.annotations}
            annotation-motivation={this.annotationMotivation}
            onSetAnnotation={(e: CustomEvent<AnnotationTuple>) => {
              this.appSetAnnotation(e.detail);
              this.appRemixMedia();
            }}
            onDeleteAnnotation={(e: CustomEvent<string>) => {
              this.appDeleteAnnotation(e.detail);
              this.appRemixMedia();
            }}
            onSelectAnnotation={(e: CustomEvent<string>) => {
              this.appSetSelectedAnnotation(e.detail);
            }}
            onSelectAnnotationMotivation={(e: CustomEvent<Motivation>) => {
              this.appSetAnnotationMotivation(e.detail);
            }}
            onReorderAnnotations={(e: CustomEvent<AnnotationMap>) => {
              this.appReorderAnnotations(e.detail);
              this.appRemixMedia();
            }}
          ></ts-editor>
          <br/>
          <span>selectedAnnotation:&nbsp;</span>{this.selectedAnnotation || "none"}<br/>
          <span>selectedMedia:&nbsp;</span>{this.selectedMedia}<br/>
          <span>annotationMotivation:&nbsp;</span>{this.annotationMotivation}<br/>
          <span>remixing:&nbsp;</span>{this.remixing ? "true" : "false"}<br/>
        </div>
      </div>
    );
  }
}
