import { combineReducers } from "redux";
import { ActionTypes, TypeKeys } from "./actions";
import { AppState } from "../interfaces/AppState";
import { Annotation, Motivation } from "../interfaces/Annotation";

export const getInitialState = () => {
  return {
    annotations: new Map<string, Annotation>(),
    annotationMotivation: Motivation.EDITING,
    remixing: false,
    remixedMedia: null,
    selectedAnnotation: null,
    selectedMedia: null
  };
};

export const app = (
  state: AppState = getInitialState(),
  action: ActionTypes
) => {
  switch (action.type) {
    case TypeKeys.APP_SET_ANNOTATION: {
      const [key, value] = action.payload;

      // merge with the current value (if any)
      const currentValue: Annotation | undefined = state.annotations.get(key);
      let nextValue: Annotation = {
        ...currentValue,
        ...value
      };

      return {
        ...state,
        // if it's new, and not an edit, select it.
        selectedAnnotation: (!currentValue && value.motivation !== Motivation.EDITING) ? key : state.selectedAnnotation,
        annotations: new Map(state.annotations).set(key, nextValue)
      };
    }
    case TypeKeys.APP_SET_ANNOTATION_MOTIVATION: {
      return {
        ...state,
        selectedAnnotation: null,
        annotationMotivation: action.payload
      };
    }
    case TypeKeys.APP_DELETE_ANNOTATION: {
      return {
        ...state,
        selectedAnnotation: state.selectedAnnotation === action.payload ? null : state.selectedAnnotation,
        annotations: new Map(
          [...state.annotations].filter(([key]) => key !== action.payload)
        )
      };
    }
    case TypeKeys.APP_REMIX_MEDIA: {
      return {
        ...state,
        remixing: true,
        remixedMedia: null
      };
    }
    case TypeKeys.APP_REMIX_SUCCEEDED: {
      return {
        ...state,
        remixing: false,
        remixedMedia: action.payload
      };
    }
    case TypeKeys.APP_REORDER_ANNOTATIONS: {
      return {
        ...state,
        annotations: action.payload
      };
    }
    case TypeKeys.APP_SET_SELECTED_ANNOTATION: {
      return {
        ...state,
        selectedAnnotation: action.payload
      };
    }
    case TypeKeys.APP_SET_SELECTED_MEDIA: {
      return {
        ...state,
        selectedMedia: action.payload
      };
    }
  }

  return state;
};

export const rootReducer = (combineReducers as any)({
  app
});
