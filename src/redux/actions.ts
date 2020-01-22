import { remixAnnotations } from "../utils";
import { Annotation, AnnotationMapTuple, AnnotationMap } from "../interfaces/Annotation";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppDeleteAnnotationAction
  | AppRemixSucceededAction
  | AppReorderAnnotationsAction
  | AppSetAnnotationAction
  | AppSetSelectedMediaAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_DELETE_ANNOTATION = "APP_DELETE_ANNOTATION",
  APP_REMIX_SUCCEEDED = "APP_REMIX_SUCCEEDED",
  APP_REORDER_ANNOTATIONS = "APP_REORDER_ANNOTATIONS",
  APP_SET_ANNOTATION = "APP_SET_ANNOTATION",
  APP_SET_SELECTED_MEDIA = "APP_SET_SELECTED_MEDIA"
}

//#region video

export interface AppSetAnnotationAction {
  type: TypeKeys.APP_SET_ANNOTATION;
  payload: AnnotationMapTuple;
}

export const appSetAnnotation = (payload: AnnotationMapTuple) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: TypeKeys.APP_SET_ANNOTATION,
    payload: payload
  });
  const response = await remixAnnotations(getState().app.annotations);
  return dispatch(appRemixSucceeded(response.remixedVideo));
};

export interface AppDeleteAnnotationAction {
  type: TypeKeys.APP_DELETE_ANNOTATION;
  payload: Annotation;
}

export const appDeleteAnnotation = (payload: Annotation) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: TypeKeys.APP_DELETE_ANNOTATION,
    payload: payload
  });
  const response = await remixAnnotations(getState().app.clips);
  return dispatch(appRemixSucceeded(response.remixedVideo));
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
  getState
) => {
  await dispatch({
    type: TypeKeys.APP_REORDER_ANNOTATIONS,
    payload: payload
  });
  const response = await remixAnnotations(getState().app.clips);
  return dispatch(appRemixSucceeded(response.remixedMedia));
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

//#endregion
