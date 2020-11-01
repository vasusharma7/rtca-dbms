import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
export default class SignUp extends Component {
  constructor(params) {
    super(params);
    this.state = {
      first_name: "",
      last_name: "",
      phone_number: "",
      pass: "",
      login: false,
    };
  }
  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = () => {
    console.log(this.state);
    if (this.state.phone_number.toString().length != 10) {
      alert("Invalid Phone Number");
      return;
    }
    try {
      axios
        .post(`${global.config.backendURL}/users/register`, this.state)
        .then((resp) => {
          console.log(resp.data);
          this.setState({ login: true });
        })
        .catch((err) => {
          try {
            alert(err.response.data.msg);
          } catch {
            alert("Something Went Wrong");
          }
          console.log(err.response);
        });
    } catch (err) {
      alert("Something Went Wrong");
    }
  };
  render() {
    return (
      <form>
        {this.state.login && <Redirect to="/join-group" />}
        <h2>Sign Up</h2>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            name="first_name"
            value={this.state.first_name}
            onChange={this.handleInput}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            name="last_name"
            placeholder="Last name"
            value={this.state.last_name}
            onChange={this.handleInput}
          />
        </div>

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

        <button
          type="button"
          className="btn btn-warning btn-block"
          onClick={this.handleSubmit}
        >
          Sign Up
        </button>
        <p className="forgot-password text-right">
          Already registered? <a href="/sign-in">Sign In</a>
        </p>
      </form>
    );
  }
}
