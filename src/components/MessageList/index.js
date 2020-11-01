import React, { Component } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import Message from "../Message";
import moment from "moment";
import { connect } from "react-redux";
import ReactNotification, { store } from "react-notifications-component";
import Notifications from "react-notification-system-redux";
import * as action from "../../redux/chatRedux/chatAction";
import ring from "../../assets/ring.mp3";
import "./MessageList.css";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      MY_USER_ID: localStorage.getItem("id"),
      first: true,
    };
    let self = this;
    (async () => await this.getData())();
    this.socket = global.config.socket;
    this.socket.on("new message", function(data) {
      if (
        ((data.to == self.state.MY_USER_ID ||
          data.from == self.state.MY_USER_ID) &&
          data.group == localStorage.getItem("group_id")) ||
        (data.dm === false && data.group == localStorage.getItem("group_id"))
      ) {
        if (
          data.to == self.state.MY_USER_ID ||
          data.group == localStorage.getItem("group_id")
        ) {
          self.props.notify(data.message);
          var sound = document.getElementsByClassName("audio-element")[0];
          if (sound.duration > 0 && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
          }
          sound.play();
        }
        if (data.from != self.state.chat) {
          if (data.dm) self.props.addBadge(data.from);
          else self.props.addBadge(data.group);
        }
        let newMessage = {
          id: self.state.messages.length + 1,
          author: data.from,
          message: data.message,
          timestamp: data.time,
        };
        self.setState({ messages: [...self.state.messages, newMessage] });
      } else {
        //have an indication there
        //new message label on chat
      }
      var div = document.querySelector("#messages");
      if (div) div.scrollIntoView(false);
    });
  }
  getData() {
    return new Promise((resolve) => {
      this.props.fetchMessages(this.props.dm, this.props.chat);
      resolve();
    });
  }

  scrollBottom = () => {
    // setTimeout(() => {
    var div = document.querySelector("#messages");
    if (div) div.scrollIntoView(false);
    // }, 1000);
  };
  componentDidMount() {
    this.scrollBottom();
  }
  componentDidUpdate() {
    this.scrollBottom();
  }
  renderMessages = () => {
    let i = 0;
    let messages = this.props.messages.concat(this.state.messages);
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author == this.state.MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          author={current.author}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }
    return tempMessages;
  };

  render() {
    return (
      <>
        <ReactNotification />
        <audio className="audio-element" style={{ display: "none" }}>
          <source src={ring} />
        </audio>
        {this.props.chat ? (
          <div className="message-list" id="message-list">
            {this.props.notifications && (
              <Notifications notifications={this.props.notifications} />
            )}
            <Toolbar
              title={`${localStorage.getItem(this.props.chat.toString())}`}
              rightItems={[
                <ToolbarButton
                  key="info"
                  icon="ion-ios-information-circle-outline"
                />,
                <ToolbarButton key="video" icon="ion-ios-videocam" />,
                <ToolbarButton key="phone" icon="ion-ios-call" />,
              ]}
            />

            <div
              className="message-list-container"
              id="messages"
              key={this.state.messages}
            >
              {this.renderMessages()}
            </div>

            <Compose
              leftItems={[
                <ToolbarButton key="photo" icon="ion-ios-camera" />,
                <ToolbarButton key="image" icon="ion-ios-image" />,
                <ToolbarButton key="audio" icon="ion-ios-mic" />,
                //<ToolbarButton key="money" icon="ion-ios-card" />,
                //<ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
              ]}
              emoji={[<ToolbarButton key="emoji" icon="ion-ios-happy" />]}
              enter={[<ToolbarButton key="send" icon="ion-ios-send" />]}
            />
          </div>
        ) : (
          <img
            style={{ width: "100%", height: "100vh" }}
            src="https://source.unsplash.com/featured/?click"
            alt="background"
          />
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state);
  return {
    notifications: state.notifications,
    loading: state.chatReducer.loading,
    users: state.chatReducer.users,
    chat: state.chatReducer.chat,
    dm: state.chatReducer.dm,
    messages: state.chatReducer.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMessages: (dm, chat) => dispatch(action.fetchMessages(dm, chat)),
    addBadge: (from) => dispatch(action.addBadge(from)),
    notify: (message) =>
      dispatch(
        Notifications.warning({
          title: "New Message Received",
          message: message,
          position: "tr",
          autoDismiss: 3,
        })
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);
