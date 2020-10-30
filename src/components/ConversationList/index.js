import React, { Component } from "react";
import ConversationSearch from "../ConversationSearch";
import ConversationListItem from "../ConversationListItem";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import { connect } from "react-redux";
import Notifications from "react-notification-system-redux";
import * as action from "../../redux/chatRedux/chatAction";
import "./ConversationList.css";

class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
    };
    if (!localStorage.getItem("id") || !localStorage.getItem("group")) {
      window.location.href = "/sign-in";
    }
    let pathname = `/chat/${localStorage.getItem("group")}`;
    if (!window.location.pathname.endsWith(localStorage.getItem("group"))) {
      window.location.pathname = pathname;
    }
    this.props.fetchUsers();
  }
  // https://dummyimage.com/1024x576/2f353a/ffffff.jpg&text=
  // https://source.unsplash.com/featured/?

  componentWillReceiveProps = () => {
    let newConversations = [];
    let urls = [
      "https://dummyimage.com/1024x576/2f353a/ffffff.jpg&text=",
      "https://source.unsplash.com/featured/?",
    ];
    console.log(this.props.users);
    this.props.users.forEach((user) => {
      if (user.id == localStorage.getItem("id")) {
        localStorage.setItem("name", `${user.first_name} ${user.last_name}`);
      } else {
        newConversations.push({
          id: user.id,
          photo: `${
            urls[user.first_name.charCodeAt(0) % 2]
          }${user.first_name.charAt(0)}`,
          name: `${user.first_name} ${user.last_name}`,
          text: "Hello world!",
          group: user.group ? true : false,
        });
      }
      localStorage.setItem(
        user.id.toString(),
        `${user.first_name} ${user.last_name}`
      );
    });
    this.setState({
      conversations: [...newConversations],
    });
  };

  // let pictures = [];
  render() {
    return (
      <div className="conversation-list">
        {/* <Notifications notifications={this.props.notifications} /> */}
        <Toolbar
          title="Messenger"
          leftItems={[<ToolbarButton key="cog" icon="ion-ios-cog" />]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />,
          ]}
        />
        <ConversationSearch />
        {this.state.conversations.map((conversation) => (
          <ConversationListItem key={conversation.name} data={conversation} />
        ))}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: () => dispatch(action.fetchUsers()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationList);
