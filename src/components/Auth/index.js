import React from "react";
import "./auth.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./login";
import SignUp from "./signup";

function Auth() {
  return (
    <Router>
      <div className="auth">
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
          <div className="container justify-content-center">
            <Link className="navbar-brand" to={"/sign-in"}>
              <h1>RTCA</h1>
            </Link>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/sign-in" component={Login} />
              <Route path="/sign-up" component={SignUp} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Auth;
