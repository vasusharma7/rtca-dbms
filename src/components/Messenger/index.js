import React, { Component } from "react";
import ConversationList from "../ConversationList";
import MessageList from "../MessageList";
import "./Messenger.css";
import { connect } from "react-redux";
import Notifications from "react-notification-system-redux";
import * as action from "../../redux/chatRedux/chatAction";
import { FaCentercode } from "react-icons/fa";

// import Toolbar from "../Toolbar";
// import ToolbarButton from "../ToolbarButton";
class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
    };
    if (!localStorage.getItem("id")) {
      window.location.href = "/sign-in";
    }
    const socket = global.config.socket;
    socket.emit("new user", localStorage.getItem("id"));
    let self = this;
    socket.on("new user", function(data) {
      self.props.addOnline(data);
    });

    socket.on("user disconnected", function(userName) {
      console.log("userName", userName);
    });
  }

  render() {
    return (
      <div className="messenger">
        {/* <Toolbar
        title="Messenger"
        leftItems={[<ToolbarButton key="cog" icon="ion-ios-cog" />]}
        rightItems={[
          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />,
        ]}
      />

      <Toolbar
        title="Conversation Title"
        rightItems={[
          <ToolbarButton
            key="info"
            icon="ion-ios-information-circle-outline"
          />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />,
        ]}
      /> */}

        {window.screen.width < 800 ? (
          this.props.open && (
            <div className="scrollable sidebar">
              <ConversationList />
            </div>
          )
        ) : (
          <div className="scrollable sidebar">
            <ConversationList />
          </div>
        )}
        {window.screen.width < 800 ? (
          !this.props.open && (
            <div className="scrollable content">
              <MessageList key={this.props.chat} />
            </div>
          )
        ) : (
          <div className="scrollable content">
            <MessageList key={this.props.chat} />
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state);
  return {
    notifications: state.notifications,
    loading: state.chatReducer.loading,
    users: state.chatReducer.users,
    online: state.chatReducer.online,
    chat: state.chatReducer.chat,
    open: state.chatReducer.open,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addOnline: (data) => dispatch(action.addData("online", data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messenger);
