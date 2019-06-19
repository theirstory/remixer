import { combineReducers } from "redux";
import { ActionTypes, TypeKeys } from "./actions";
import { AppState } from "../interfaces/AppState";
//import { addClip, removeClip } from "../utils";

export const getInitialState = () => {
  return {
    clips: [],
    remixing: false,
    remixedVideo: null,
    selectedVideo: null
  };
};

export const app = (
  state: AppState = getInitialState(),
  action: ActionTypes
) => {
  switch (action.type) {
    case TypeKeys.APP_ADD_CLIP: {
      return {
        ...state,
        remixing: true,
        remixedVideo: null,
        clips: [...state.clips, action.payload]
      };
    }
    case TypeKeys.APP_REMOVE_CLIP: {
      return {
        ...state,
        remixing: true,
        remixedVideo: null,
        clips: [...state.clips].filter(clip => clip.id !== action.payload.id)
      };
    }
    case TypeKeys.APP_REMIX_CLIPS_SUCCEEDED: {
      return {
        ...state,
        remixing: false,
        remixedVideo: action.payload
      };
    }
    case TypeKeys.APP_SET_SELECTED_VIDEO: {
      return {
        ...state,
        selectedVideo: action.payload
      };
    }
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});