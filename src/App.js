import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Homepage from "./Homepage/Homepage";
import SignUpPage from "./Login/SignUpPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={SignUpPage} />
        <Route exact path="/home" component={Homepage} />
        <Route exact path="/home/:tag" component={Homepage} />
        <Route exact path="/picture/:pictureId" component={Content} />
        <Route exact path="/profile/:name" component={Profile} />
        <Route exact path="/setting" component={() => <>setting</>} />
        <Route exact path="/logout" component={() => <>logout</>} />
      </Switch>
    </Router>
  );
}
