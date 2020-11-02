import {
  FETCH_FAILURE,
  FETCH_SUCCESS,
  LOADING,
  ADD_BADGE,
  RESET_BADGE,
  SWITCH,
} from "./chatActionTypes";

export const initalState = {
  loading: false,
  users: [],
  messages: [],
  chat: "",
  online: [],
  dm: true,
  badge: {},
  open: window.screen.width < 800 ? true : false,
};
var temp;
export const chatReducer = (state = initalState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case RESET_BADGE:
      temp = state.badge;
      temp[action.payload] = 0;
      return {
        ...state,
        badge: temp,
      };
    case SWITCH:
      temp = state.open;
      return {
        ...state,
        open: !temp,
      };
    case ADD_BADGE:
      temp = state.badge;
      temp[action.payload] = temp[action.payload]
        ? temp[action.payload] + 1
        : 1;
      return {
        ...state,
        badge: temp,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        [action.payload.key]: action.payload.data,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};
export default chatReducer;
