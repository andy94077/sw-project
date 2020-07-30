import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  // BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
import Bar from "./Bar/Bar";
import Homepage from "./Homepage/Homepage";
import SignUpPage from "./Login/SignUpPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";
import Loading from "./components/Loading";
import { getCookie } from "./cookieHelper";

export default function App() {
  const [user, setUser] = useState({ username: null, userId: null });
  const [isReady, setIsReady] = useState(true);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const accessToken = getCookie();
    if (window.location.pathname !== "/") {
      setIsReady(false);
      axios
        .post("http://pinterest-server.test/api/v1/user/authentication", {
          accessToken,
        })
        .then((res) => {
          if (res.data.isValid === true)
            setUser({ username: res.data.username, userId: res.data.user_id });
          else history.push("/");
          setIsReady(true);
        });
    }
  }, [location]);

  if (isReady) {
    return (
      <div>
        {window.location.pathname !== "/" && <Bar username={user.username} />}
        <Switch>
          <Route exact path="/" component={SignUpPage} />
          <Route exact path="/home" component={Homepage} />
          <Route exact path="/home/:tag" component={Homepage} />
          <Route
            exact
            path="/picture/:pictureId"
            render={(props) => (
              <Content
                username={user.username}
                userId={user.userId}
                match={props.match}
              />
            )}
          />
          <Route
            exact
            path="/profile/:name"
            render={(props) => (
              <Profile
                username={user.username}
                userId={user.userId}
                match={props.match}
              />
            )}
          />
          <Route exact path="/setting" component={() => <>setting</>} />
          <Route exact path="/logout" component={() => <>logout</>} />
        </Switch>
      </div>
    );
  }
  return <Loading />;
}
