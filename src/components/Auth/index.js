import React from "react";
import "./auth.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Messenger from "../Messenger/index";
import Chores from "./chores";
function Auth() {
  return (
    <Router>
      <Switch>
        <Route path="/chat/:group" component={Messenger} />
        <Route path="/" component={Chores} />
      </Switch>
    </Router>
  );
}

export default Auth;
