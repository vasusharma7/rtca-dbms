import React, { Component } from "react";
import "./Compose.css";
import { connect } from "react-redux";
import * as action from "../../redux/chatRedux/chatAction";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: localStorage.getItem("id"),
      message: "",
      showEmojis: false,
    };
    this.socket = global.config.socket;
    // let self = this;
  }

  showEmojis = e => {
    this.setState(
      {
        showEmojis: true
      },
      () => document.addEventListener("click", this.closeMenu)
    );
  };

  closeMenu = e => {
    console.log(this.emojiPicker);
    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
      this.setState(
        {
          showEmojis: false
        },
        () => document.removeEventListener("click", this.closeMenu)
      );
    }
  };

  addEmoji = e => {
    // console.log(e.native);
    let emoji = e.native;
    this.setState({
      message: this.state.message + emoji
    });
  };

  sendMessage = () => {
    if (
      this.state.message === "" ||
      this.state.message.replace(/(\r\n|\n|\r)/gm, "") === ""
    )
      return;
    this.socket.emit("new message", {
      id: new Date().getTime(),
      from: this.state.id,
      message: this.state.message,
      to: this.props.chat,
      dm: this.props.dm,
      group: localStorage.getItem("group_id"),
    });
    this.setState({ message: "" });
  };

  render() {
    return (
      <div className="divide">

      <div className="compose">

      {
        this.props.image
      }

      {this.state.showEmojis ? (
        <div className="emojiPicker" ref={el => (this.emojiPicker = el)}>
          <Picker
            onSelect={this.addEmoji}
            emojiTooltip={true}
            title="RTCA"
          />
        </div>
      ) : (
        <div className="getEmojiButton" onClick={this.showEmojis}>
          {this.props.emoji}
        </div>
      )}

        <input
          value={this.state.message}
          type="text"
          onKeyDown={(e) => {
            if (e.keyCode === 13) this.sendMessage();
          }}
          onChange={(e) => {
            this.setState({ message: e.target.value });
          }}
          className="compose-input"
          placeholder="Type a message"
        />

        <button
          className="options"
          style={{
            outline: "None",
          }}
          onClick={(e) => {
            e.preventDefault();
            this.sendMessage();
          }}
        >
        {
        this.props.enter
        }
        </button>



        {/* <div className="options">

      </div> */}
        {/* {props.rightItems} */}
      </div>
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
    dm: state.chatReducer.dm,
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
)(Compose);
