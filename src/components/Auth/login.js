import React, { Component } from "react";
import axios from "axios";
export default class Login extends Component {
  constructor(params) {
    super(params);
    this.state = {
      phone_number: "123",
      pass: "123",
      group: "family",
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
      .post(`${global.config.backendURL}/users/login`, this.state)
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("id", this.state.phone_number);
        localStorage.setItem("group", this.state.group);
        window.location.href = `chat/${this.state.group}`;
      })
      .catch((err) => {
        alert(err.response.data.msg);
        console.log(err.response);
      });
  };
  render() {
    return (
      <form>
        <h2>Sign In</h2>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            value={this.state.phone_number}
            type="tel"
            name="phone_number"
            className="form-control"
            placeholder="Enter Phone Number"
            onChange={this.handleInput}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="pass"
            value={this.state.pass}
            type="password"
            className="form-control"
            placeholder="Enter password"
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
        {/* <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div> */}

        <button
          type="button"
          className="btn btn-warning btn-block"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
        <p className="forgot-password text-right">
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </p>

        <p className="forgot-password text-right">
          Want to join a group? <a href="/join-group">Join</a>
        </p>
      </form>
    );
  }
}
