import {
  FETCH_FAILURE,
  FETCH_SUCCESS,
  LOADING,
  ADD_BADGE,
  RESET_BADGE,
} from "./chatActionTypes";
import axios from "axios";
import Notifications from "react-notification-system-redux";
export const fetchRequest = () => {
  return {
    type: LOADING,
  };
};
export const resetBadge = (id) => {
  return {
    type: RESET_BADGE,
    payload: id,
  };
};
export const addData = (key, data) => {
  return {
    type: FETCH_SUCCESS,
    payload: { key: key, data: data },
  };
};
export const fetchFailure = (error) => {
  return {
    type: FETCH_FAILURE,
    error: error,
  };
};
export const addBadge = (user) => {
  return {
    type: ADD_BADGE,
    payload: user,
  };
};

export const fetchUsers = () => {
  const id = localStorage.getItem("id");
  const group = localStorage.getItem("group");
  if (!id) return;
  return async function(dispatch) {
    dispatch(fetchRequest());
    await axios
      .get(`${global.config.backendURL}/chat/users/${id}/${group}`)
      .then(async (res) => {
        dispatch(addData("users", res.data));
        dispatch(
          Notifications.success({
            title: "Contacts Fetched Successfully",
            position: "tr",
            autoDismiss: 3,
          })
        );
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
        dispatch(
          Notifications.error({
            title: "Contacts Fetching Failed",
            message: err.response ? err.response.data : "Server Error",
            position: "tr",
            autoDismiss: 3,
          })
        );
        dispatch(fetchFailure(err));
      });
  };
};

export const fetchMessages = (dm, user) => {
  const id = localStorage.getItem("id");
  const group = localStorage.getItem("group_id");
  if (!id) return;
  let url = `${global.config.backendURL}/chat/userMessages`;

  return async function(dispatch) {
    dispatch(fetchRequest());
    await axios
      .post(url, { id, group, user, dm })
      .then(async (res) => {
        dispatch(addData("messages", res.data));
        dispatch(
          Notifications.success({
            title: "Mesages Fetched Successfully",
            position: "tr",
            autoDismiss: 3,
          })
        );
      })
      .catch((err) => {
        console.log("fetch error", err);
        dispatch(fetchFailure(err));
      });
  };
};
