import { remixAnnotations, filterAnnotationsByMotivation } from "../utils";
import { Annotation, AnnotationTuple, AnnotationMap, Motivation } from "../interfaces/Annotation";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppClearAnnotationsAction
  | AppDeleteAnnotationAction
  | AppRemixMediaAction
  | AppRemixSucceededAction
  | AppReorderAnnotationsAction
  | AppSetAnnotationAction
  | AppSetAnnotationMotivationAction
  | AppSetSelectedAnnotationAction
  | AppSetSelectedMediaAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_CLEAR_ANNOTATIONS = "APP_CLEAR_ANNOTATIONS",
  APP_DELETE_ANNOTATION = "APP_DELETE_ANNOTATION",
  APP_REMIX_MEDIA = "APP_REMIX_MEDIA",
  APP_REMIX_SUCCEEDED = "APP_REMIX_SUCCEEDED",
  APP_REORDER_ANNOTATIONS = "APP_REORDER_ANNOTATIONS",
  APP_SET_ANNOTATION = "APP_SET_ANNOTATION",
  APP_SET_ANNOTATION_MOTIVATION = "APP_SET_ANNOTATION_MOTIVATION",
  APP_SET_SELECTED_ANNOTATION = "APP_SET_SELECTED_ANNOTATION",
  APP_SET_SELECTED_MEDIA = "APP_SET_SELECTED_MEDIA"
}

//#region media

export interface AppClearAnnotationsAction {
  type: TypeKeys.APP_CLEAR_ANNOTATIONS;
  payload: void;
}

export const appClearAnnotations = () => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_CLEAR_ANNOTATIONS
  });
};

export interface AppSetAnnotationAction {
  type: TypeKeys.APP_SET_ANNOTATION;
  payload: AnnotationTuple;
}

export const appSetAnnotation = (payload: AnnotationTuple) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_ANNOTATION,
    payload: payload
  });
};

export interface AppSetAnnotationMotivationAction {
  type: TypeKeys.APP_SET_ANNOTATION_MOTIVATION;
  payload: Motivation;
}

export const appSetAnnotationMotivation = (payload: Motivation) => async (
  dispatch
) => {
  return dispatch({
    type: TypeKeys.APP_SET_ANNOTATION_MOTIVATION,
    payload: payload
  });
};

export interface AppDeleteAnnotationAction {
  type: TypeKeys.APP_DELETE_ANNOTATION;
  payload: Annotation;
}

export const appDeleteAnnotation = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_DELETE_ANNOTATION,
    payload: payload
  });
};

export interface AppRemixSucceededAction {
  type: TypeKeys.APP_REMIX_SUCCEEDED;
  payload: string;
}

export const appRemixSucceeded = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_REMIX_SUCCEEDED,
    payload: payload
  });
};

export interface AppReorderAnnotationsAction {
  type: TypeKeys.APP_REORDER_ANNOTATIONS;
  payload: AnnotationMap;
}

export const appReorderAnnotations = (payload: AnnotationMap) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_REORDER_ANNOTATIONS,
    payload: payload
  });
};

export interface AppSetSelectedAnnotationAction {
  type: TypeKeys.APP_SET_SELECTED_ANNOTATION;
  payload: string;
}

export const appSetSelectedAnnotation = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SELECTED_ANNOTATION,
    payload: payload
  });
};

export interface AppSetSelectedMediaAction {
  type: TypeKeys.APP_SET_SELECTED_MEDIA;
  payload: string;
}

export const appSetSelectedMedia = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SELECTED_MEDIA,
    payload: payload
  });
};

export interface AppRemixMediaAction {
  type: TypeKeys.APP_REMIX_MEDIA;
  payload: void;
}

export const appRemixMedia = () => async (
  dispatch,
  getState
) => {
  dispatch({
    type: TypeKeys.APP_REMIX_MEDIA
  });
  const clips: AnnotationMap = filterAnnotationsByMotivation(getState().app.annotations, Motivation.EDITING);
  const response = await remixAnnotations(clips);
  return dispatch(appRemixSucceeded(response.remixedMedia));
};

//#endregion
