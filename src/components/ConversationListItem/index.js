import React, { useEffect } from "react";
import shave from "shave";
import { connect } from "react-redux";
import * as action from "../../redux/chatRedux/chatAction";
import "./ConversationListItem.css";

function ConversationListItem(props) {
  useEffect(() => {
    shave(".conversation-snippet", 20);
  });

  const { id, photo, name, text } = props.data;
  const openChat = (id) => {
    props.resetBadge(id);
    props.openChat(id);
  };
  return (
    <div
      id={`conversation-item-${id}`}
      className="conversation-list-item"
      onClick={() => openChat(id)}
      style={{ backgroundColor: props.badge[id] ? "#444" : "" }}
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    resetBadge: (id) => dispatch(action.resetBadge(id)),
    openChat: (id) => dispatch(action.addData("chat", id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationListItem);
