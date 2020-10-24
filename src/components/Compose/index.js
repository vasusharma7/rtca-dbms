import React, { Component } from "react";
import "./Compose.css";
import { connect } from "react-redux";
import * as action from "../../redux/chatRedux/chatAction";
class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: localStorage.getItem("id"),
      message: "",
    };
    this.socket = global.config.socket;
    // let self = this;
  }
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
      <div className="compose">
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
          placeholder="Type a message, @name"
        />
        <button
          className="options"
          style={{
            backgroundColor: "#0063ce",
            borderRadius: "50px",
            border: 0,
            transform: "scale(1.5)",
          }}
          onClick={(e) => {
            e.preventDefault();
            this.sendMessage();
          }}
        >
          <i class="ion-ios-send" style={{ color: "white" }} />
        </button>
        {/* <div className="options">
        
      </div> */}
        {/* {props.rightItems} */}
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
