export interface NullAction {
  type: TypeKeys.NULL;
}

// Keep this type updated with each known action
export type ActionTypes = NullAction | AppSetSelectedVideoAction;

export enum TypeKeys {
  NULL = "NULL",
  ERROR = "ERROR",
  APP_SET_SELECTED_VIDEO = "APP_SET_SELECTED_VIDEO"
}

//#region video

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
