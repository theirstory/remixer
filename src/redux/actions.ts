import { Clip } from "../interfaces/clip";
import { mergeClips } from "../utils";

export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes =
  | NullAction
  | AppAddClipAction
  | AppRemoveClipAction
  | AppMergeClipsAction
  | AppMergeClipsSucceededAction
  | AppSetSelectedVideoAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_ADD_CLIP = "APP_ADD_CLIP",
  APP_REMOVE_CLIP = "APP_REMOVE_CLIP",
  APP_MERGE_CLIPS = "APP_MERGE_CLIPS",
  APP_MERGE_CLIPS_SUCCEEDED = "APP_MERGE_CLIPS_SUCCEEDED",
  APP_SET_SELECTED_VIDEO = "APP_SET_SELECTED_VIDEO"
}

//#region video

export interface AppAddClipAction {
  type: TypeKeys.APP_ADD_CLIP;
  payload: Clip;
}

export const appAddClip = (payload: Clip) => async (dispatch, _getState) => {
  return dispatch({
    type: TypeKeys.APP_ADD_CLIP,
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

export interface AppMergeClipsAction {
  type: TypeKeys.APP_MERGE_CLIPS;
  payload: Clip[];
}

export const appMergeClips = (payload: Clip[]) => async (
  dispatch,
  _getState
) => {
  const mergedVideo = await mergeClips(payload);
  return dispatch(appMergeClipsSucceeded(mergedVideo));
};

export interface AppMergeClipsSucceededAction {
  type: TypeKeys.APP_MERGE_CLIPS_SUCCEEDED;
  payload: string;
}

export const appMergeClipsSucceeded = (payload: string) => async (
  dispatch,
  _getState
) => {
  return dispatch({
    type: TypeKeys.APP_MERGE_CLIPS_SUCCEEDED,
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
