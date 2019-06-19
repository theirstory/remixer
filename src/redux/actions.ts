import { Clip } from "../interfaces/clip";
import { remixClips } from "../utils";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppAddClipAction
  | AppRemoveClipAction
  | AppRemixClipsAction
  | AppRemixClipsSucceededAction
  | AppSetSelectedVideoAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_ADD_CLIP = "APP_ADD_CLIP",
  APP_REMOVE_CLIP = "APP_REMOVE_CLIP",
  APP_REMIX_CLIPS = "APP_REMIX_CLIPS",
  APP_REMIX_CLIPS_SUCCEEDED = "APP_REMIX_CLIPS_SUCCEEDED",
  APP_SET_SELECTED_VIDEO = "APP_SET_SELECTED_VIDEO"
}

//#region video

export interface AppAddClipAction {
  type: TypeKeys.APP_ADD_CLIP;
  payload: Clip;
}

export const appAddClip = (payload: Clip) => async (dispatch, _getState) => {
  dispatch({
    type: TypeKeys.APP_ADD_CLIP,
    payload: payload
  });
  return appRemixClips(_getState().clips);
};

export interface AppRemoveClipAction {
  type: TypeKeys.APP_REMOVE_CLIP;
  payload: Clip;
}

export const appRemoveClip = (payload: Clip) => async (dispatch, _getState) => {
  dispatch({
    type: TypeKeys.APP_REMOVE_CLIP,
    payload: payload
  });
  return appRemixClips(_getState().clips);
};

export interface AppRemixClipsAction {
  type: TypeKeys.APP_REMIX_CLIPS;
  payload: Clip[];
}

export const appRemixClips = (payload: Clip[]) => async (
  dispatch,
  _getState
) => {
  const response = await remixClips(payload);
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