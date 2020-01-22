import { Component, Prop, h, State } from "@stencil/core";
import "@stencil/redux";
import { Store, Action } from "@stencil/redux";
import {
  appSetSelectedMedia,
  appSetAnnotation,
  appDeleteAnnotation,
  appReorderAnnotations
} from "../../redux/actions";
import { configureStore } from "../../redux/store";
import { Annotation, Motivation } from "../../interfaces/Annotation";
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
  appDeleteAnnotation: Action;
  appReorderAnnotations: Action;
  appSetSelectedMedia: Action;
  //#endregion

  //#region state
  @State() annotations: Map<string, Annotation>;
  @State() remixedMedia: string;
  @State() remixing: boolean;
  @State() selectedMedia: string;
  //#endregion

  componentWillLoad() {
    // redux
    this.store.setStore(configureStore({}));

    this.store.mapStateToProps(this, state => {
      const {
        app: { annotations, remixedMedia, remixing, selectedMedia }
      } = state;

      return {
        annotations,
        remixedMedia,
        remixing,
        selectedMedia
      };
    });

    this.store.mapDispatchToProps(this, {
      appSetAnnotation,
      appDeleteAnnotation,
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
            remixed-media={this.remixedMedia}
            annotations={this.annotations}
            // onUpdateAnnotation={(e: CustomEvent<Annotation>) => {
            //   this.appSetAnnotation(e.detail);
            // }}
            // onDeleteAnnotation={(e: CustomEvent<Annotation>) => {
            //   this.appDeleteAnnotation(e.detail);
            // }}
            // onReorderAnnotations={(e: CustomEvent<Annotation[]>) => {
            //   this.appReorderAnnotations(e.detail);
            // }}
          ></ts-editor>
        </div>
      </div>
    );
  }
}
