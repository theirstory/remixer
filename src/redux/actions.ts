import { Clip } from "../interfaces/clip";
import { addClip } from "../utils";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppAddClipAction
  | AppAddClipSucceededAction
  | AppRemoveClipAction
  | AppRemoveClipSucceededAction
  | AppSetSelectedVideoAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_ADD_CLIP = "APP_ADD_CLIP",
  APP_ADD_CLIP_SUCCEEDED = "APP_ADD_CLIP_SUCCEEDED",
  APP_REMOVE_CLIP = "APP_REMOVE_CLIP",
  APP_REMOVE_CLIP_SUCCEEDED = "APP_REMOVE_CLIP_SUCCEEDED",
  APP_SET_SELECTED_VIDEO = "APP_SET_SELECTED_VIDEO"
}

//#region video

export interface AppAddClipAction {
  type: TypeKeys.APP_ADD_CLIP;
  payload: Clip;
}

export const appAddClip = (payload: Clip) => async (dispatch, _getState) => {
  const response = await addClip(payload);
  return dispatch(appAddClipSucceeded(response));
};

export interface AppAddClipSucceededAction {
  type: TypeKeys.APP_ADD_CLIP_SUCCEEDED;
  payload: Clip;
}

export const appAddClipSucceeded = (payload: Clip) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_ADD_CLIP_SUCCEEDED,
    payload: payload
  });
};

export interface AppRemoveClipAction {
  type: TypeKeys.APP_REMOVE_CLIP;
  payload: Clip;
}

export const appRemoveClip = (payload: Clip) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_REMOVE_CLIP,
    payload: payload
  });
};

export interface AppRemoveClipSucceededAction {
  type: TypeKeys.APP_REMOVE_CLIP_SUCCEEDED;
  payload: Clip;
}

export const appRemoveClipSucceeded = (payload: Clip) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_REMOVE_CLIP_SUCCEEDED,
    payload: payload
  });
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

//#endregion
