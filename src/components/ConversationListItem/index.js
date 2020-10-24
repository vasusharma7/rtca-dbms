import React, { useEffect } from "react";
import shave from "shave";
import { connect } from "react-redux";
import * as action from "../../redux/chatRedux/chatAction";
import "./ConversationListItem.css";

function ConversationListItem(props) {
  useEffect(() => {
    shave(".conversation-snippet", 20);
    if (props.data.group) {
      localStorage.setItem("group_id", id);
    }
  });

  const { id, photo, name, text } = props.data;
  const openChat = (id) => {
    if (!localStorage.getItem("group_id").localeCompare(id)) props.setDM(false);
    else props.setDM(true);
    props.resetBadge(id);
    props.openChat(id);
  };
  return (
    <div
      id={`conversation-item-${id}`}
      className="conversation-list-item"
      onClick={() => openChat(id)}
      style={{
        backgroundColor: props.badge[id] ? "#444" : "",
      }}
    >
      <img className="conversation-photo" src={photo} alt="DP" />
      <div className="conversation-info">
        <h1 className="conversation-title">{name}</h1>
        <p className="conversation-snippet">{text}</p>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    badge: state.chatReducer.badge,
    chat: state.chatReducer.chat,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    resetBadge: (id) => dispatch(action.resetBadge(id)),
    openChat: (id) => dispatch(action.addData("chat", id)),
    setDM: (val) => dispatch(action.addData("dm", val)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationListItem);
