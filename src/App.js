import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./Homepage/Homepage";
import LoginPage from "./Login/SignUpPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/picture/:pictureId" component={Content} />
        <Route exact path="/profile/:name" component={Profile} />
        <Route exact path="setting" component={() => <>setting</>} />
        <Route exact path="logout" component={() => <>logout</>} />
      </Switch>
    </Router>
  );
}
