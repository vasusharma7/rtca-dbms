import { combineReducers } from "redux";
import { reducer as notifications } from "react-notification-system-redux";
import { chatReducer } from "./chatRedux/chatReducer";

export const rootReducer = combineReducers({
  notifications,
  chatReducer,
});
