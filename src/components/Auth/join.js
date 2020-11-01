import React, { Component } from "react";
import axios from "axios";
export default class Join extends Component {
  constructor(params) {
    super(params);
    this.state = {
      phone_number: "",
      group: "",
    };
  }
  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = () => {
    console.log(this.state);
    axios
      .post(`${global.config.backendURL}/users/join-group`, this.state)
      .then((resp) => {
        alert("Group Successfully Joined");
        console.log(resp.data);
        localStorage.setItem("id", this.state.phone_number);
        window.location.href = "/sign-in";
      })
      .catch((err) => {
        try {
          alert(err.response.data.msg);
        } catch {
          alert("Something Went Wrong");
        }
        console.log(err.response);
      });
  };
  render() {
    return (
      <form>
        <h2>Join Group</h2>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            value={this.state.phone_number}
            type="tel"
            name="phone_number"
            className="form-control"
            placeholder="Username"
            onChange={this.handleInput}
          />
        </div>

        <div className="form-group">
          <label>Group Name</label>
          <input
            name="group"
            value={this.state.group}
            type="text"
            className="form-control"
            placeholder="Enter Group Name"
            onChange={this.handleInput}
          />
        </div>

        <button
          type="button"
          className="btn btn-warning btn-block"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
        <p className="forgot-password text-right">
          Don't have a group? <a href="/make-group">Make</a>
        </p>
      </form>
    );
  }
}
