import { remixClips } from "../utils";
import { Annotation } from "../interfaces/Annotation";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppAddClipAction
  | AppRemoveClipAction
  | AppRemixClipsSucceededAction
  | AppReorderClipsAction
  | AppSetSelectedVideoAction
  | AppUpdateClipAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_ADD_CLIP = "APP_ADD_CLIP",
  APP_REMOVE_CLIP = "APP_REMOVE_CLIP",
  APP_REMIX_CLIPS_SUCCEEDED = "APP_REMIX_CLIPS_SUCCEEDED",
  APP_REORDER_CLIPS = "APP_REORDER_CLIPS",
  APP_SET_SELECTED_VIDEO = "APP_SET_SELECTED_VIDEO",
  APP_UPDATE_CLIP = "APP_UPDATE_CLIP"
}

//#region video

export interface AppAddClipAction {
  type: TypeKeys.APP_ADD_CLIP;
  payload: Annotation;
}

export const appAddClip = (payload: Annotation) => async (dispatch, getState) => {
  await dispatch({
    type: TypeKeys.APP_ADD_CLIP,
    payload: payload
  });
  const response = await remixClips(getState().app.clips);
  return dispatch(appRemixClipsSucceeded(response.remixedVideo));
};

export interface AppRemoveClipAction {
  type: TypeKeys.APP_REMOVE_CLIP;
  payload: Annotation;
}

export const appRemoveClip = (payload: Annotation) => async (dispatch, getState) => {
  await dispatch({
    type: TypeKeys.APP_REMOVE_CLIP,
    payload: payload
  });
  const response = await remixClips(getState().app.clips);
  return dispatch(appRemixClipsSucceeded(response.remixedVideo));
};

export interface AppRemixClipsSucceededAction {
  type: TypeKeys.APP_REMIX_CLIPS_SUCCEEDED;
  payload: string;
}

export const appRemixClipsSucceeded = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_REMIX_CLIPS_SUCCEEDED,
    payload: payload
  });
};

export interface AppReorderClipsAction {
  type: TypeKeys.APP_REORDER_CLIPS;
  payload: Annotation[];
}

export const appReorderClips = (payload: Annotation[]) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: TypeKeys.APP_REORDER_CLIPS,
    payload: payload
  });
  const response = await remixClips(getState().app.clips);
  return dispatch(appRemixClipsSucceeded(response.remixedVideo));
};

export interface AppSetSelectedVideoAction {
  type: TypeKeys.APP_SET_SELECTED_VIDEO;
  payload: string;
}

export const appSetSelectedVideo = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_SET_SELECTED_VIDEO,
    payload: payload
  });
};

export interface AppUpdateClipAction {
  type: TypeKeys.APP_UPDATE_CLIP;
  payload: Annotation;
}

export const appUpdateClip = (payload: Annotation) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_UPDATE_CLIP,
    payload: payload
  });
};

//#endregion
