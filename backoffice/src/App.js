import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import Post from "./Post/Post";
import User from "./User/User";
import LoginPage from "./Login/LoginPage";
import BOUser from "./BOUser/BOUser";
import Dashboard from "./Dashboard/Dashboard";
import Announcement from "./Announcement/Announcement";
import ErrorMsg from "./components/ErrorMsg";
import Loading from "./components/Loading";
import Bar from "./Bar/Bar";

import { getCookie, deleteCookie } from "./cookieHelper";
import { CONCAT_SERVER_URL } from "./utils";
import { setUser, selectUser } from "./redux/userSlice";

export default function App() {
  const [isReady, setIsReady] = useState(true);
  const [error, setError] = useState({ message: "", url: "" });
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const accessToken = getCookie();
    setError({ message: "", url: "" });
    dispatch(setUser({ username: null, userId: null, apiToken: null }));
    if (location.pathname !== "/" || accessToken !== null) {
      setIsReady(false);
      axios
        .post(CONCAT_SERVER_URL("/api/v1/superUser/authentication"), {
          accessToken,
        })
        .then((res) => {
          if (res.data.isValid === true) {
            dispatch(
              setUser({
                username: res.data.username,
                userId: res.data.user_id,
                apiToken: res.data.api_token,
              })
            );
            if (location.pathname === "/") history.push("/dashboard");
          } else {
            deleteCookie();
            history.push("/");
          }
        })
        .catch(() => {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        })
        .finally(() => setIsReady(true));
    }
  }, [location, history, dispatch]);

  if (isReady) {
    if (error.message !== "") {
      return <ErrorMsg message={error.message} imgUrl={error.url} />;
    }
    if (location.pathname === "/") {
      return (
        <Switch>
          <Route exact path="/" component={LoginPage} />
        </Switch>
      );
    }
    return (
      <Bar
        username={user.username}
        content={
          <Switch>
            <Route exact path={"/dashboard"} component={Dashboard} />
            <Route exact path={"/user"} component={User} />
            <Route exact path={"/post"} component={Post} />
            <Route exact path={"/BOUser"} component={BOUser} />
            <Route exact path={"/Announcement"} component={Announcement} />
          </Switch>
        }
      />
    );
  }
  return <Loading />;
}
