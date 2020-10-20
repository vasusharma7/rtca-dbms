import React, { Component } from "react";
import axios from "axios";
export default class Login extends Component {
  constructor(params) {
    super(params);
    this.state = {
      phone_number: "123",
      pass: "123",
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
        window.location.reload();
      })
      .catch((err) => {
        alert(err.response.data.msg);
        console.log(err.response);
      });
  };
  render() {
    return (
      <form>
        <h3>Sign In</h3>

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
          className="btn btn-primary btn-block"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
        <p className="forgot-password text-right">
          Don't Have an Account ? <a href="/sign-up">Sign Up</a>
        </p>
      </form>
    );
  }
}
