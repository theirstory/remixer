import { combineReducers } from "redux";
import { ActionTypes, TypeKeys } from "./actions";
import { AppState } from "../interfaces/AppState";
//import { addClip, removeClip } from "../utils";

export const getInitialState = () => {
  return {
    clips: [],
    mergedVideo: null,
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
        clips: [...state.clips, action.payload]
      };
    }
    // case TypeKeys.APP_REMOVE_CLIP_SUCCESS: {
    //   removeClip(action.payload);
    //   return {
    //     ...state,
    //     clips: [...state.clips].filter(
    //       clip =>
    //         clip.video !== action.payload.video &&
    //         clip.start !== action.payload.start &&
    //         clip.end !== action.payload.end
    //     )
    //   };
    // }
    case TypeKeys.APP_MERGE_CLIPS_SUCCEEDED: {
      return {
        ...state,
        mergedVideo: action.payload
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
