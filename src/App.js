import React from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HomePage from "./Homepage/Homepage";
import LoginPage from "./Login/LoginPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";

export default function App() {
  return (
    <Router>
      <Link variant="contained" color="primary" to="/">
        LoginPage
      </Link>
      <Link variant="contained" color="primary" to="/home">
        Homepage
      </Link>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/picture/:pictureId" component={Content} />
        <Route exact path="/profile/:name" component={Profile} />
      </Switch>
    </Router>
  );
}
