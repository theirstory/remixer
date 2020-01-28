import { Component, Prop, h, State } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import {
  appDeleteAnnotation,
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
  appSetAnnotation: Action;
  appSetAnnotationMotivation: Action;
  appDeleteAnnotation: Action;
  appReorderAnnotations: Action;
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
      appSetAnnotation,
      appSetAnnotationMotivation,
      appDeleteAnnotation,
      appSetSelectedAnnotation,
      appSetSelectedMedia,
      appReorderAnnotations
    });
  }

  render() {
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
            }}
          ></ts-cutting-room>
        </div>
        <div class="col">
          <ts-editor
            selectedAnnotation={this.selectedAnnotation}
            remixed-media={this.remixedMedia}
            annotations={this.annotations}
            annotation-motivation={this.annotationMotivation}
            onSetAnnotation={(e: CustomEvent<AnnotationTuple>) => {
              this.appSetAnnotation(e.detail);
            }}
            onDeleteAnnotation={(e: CustomEvent<string>) => {
              this.appDeleteAnnotation(e.detail);
            }}
            onSelectAnnotation={(e: CustomEvent<string>) => {
              this.appSetSelectedAnnotation(e.detail);
            }}
            onSelectAnnotationMotivation={(e: CustomEvent<Motivation>) => {
              this.appSetAnnotationMotivation(e.detail);
            }}
            onReorderAnnotations={(e: CustomEvent<AnnotationMap>) => {
              this.appReorderAnnotations(e.detail);
            }}
          ></ts-editor>
          <br/>
          {this.selectedAnnotation || "none"}<br/>
          {this.annotations.size}<br/>
          {this.selectedMedia}<br/>
          {this.annotationMotivation}
        </div>
      </div>
    );
  }
}
