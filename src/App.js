import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import { addHours, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";

import Echo from "laravel-echo";
import io from "socket.io-client";

import Bar from "./Bar/Bar";
import Homepage from "./Homepage/Homepage";
import SignUpPage from "./Login/SignUpPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";
import { getCookie } from "./cookieHelper";
import { setData, selectUser } from "./redux/userSlice";

import { REDIS_URL } from "./constants";
import { CONCAT_SERVER_URL } from "./utils";
import AlertDialog from "./components/AlertDialog";
import ErrorMsg from "./components/ErrorMsg";
import Loading from "./components/Loading";

export default function App() {
  const [isReady, setIsReady] = useState(true);
  const [error, setError] = useState({ message: "", url: "" });
  const location = useLocation();
  const history = useHistory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  function handleClose() {
    setIsDialogOpen(false);
  }

  useEffect(() => {
    document.title = "賭ケグルイ";
  }, []);

  // Broadcast
  useEffect(() => {
    window.io = io;
    if (user.apiToken !== null) {
      window.Echo = new Echo({
        broadcaster: "socket.io",
        host: REDIS_URL, // this is laravel-echo-server host
        auth: {
          headers: {
            Authorization: `Bearer ${user.apiToken}`,
          },
        },
      });
      window.Echo.join("Online");
    }
  }, [user.apiToken]);

  useEffect(() => {
    const accessToken = getCookie();
    setError({ message: "", url: "" });
    if (location.pathname !== "/" || accessToken !== null) {
      setIsReady(false);
      axios
        .post(CONCAT_SERVER_URL("/api/v1/user/authentication"), {
          accessToken,
        })
        .then((res) => {
          if (res.data.isValid === true) {
            dispatch(
              setData({
                username: res.data.username,
                user_id: res.data.user_id,
                userAvatar: res.data.avatar_url,
                bucket_time: res.data.bucket_time,
                api_token: res.data.api_token,
              })
            );

            if (location.pathname === "/") history.push("/home");
          } else {
            dispatch(
              setData({
                username: null,
                user_id: null,
                userAvatar: null,
                bucket_time: null,
                api_token: null,
              })
            );
          }
        })
        .catch(() => {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        })
        .finally(() => setIsReady(true));
    } else {
      dispatch(
        setData({
          username: null,
          user_id: null,
          userAvatar: null,
          bucket_time: null,
          api_token: null,
        })
      );
    }
  }, [location, history]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (user.userId !== null) {
        axios
          .post(CONCAT_SERVER_URL("/api/v1/user/count"), {
            id: user.userId,
          })
          .catch(() => {
            setError({
              message: "Connection Error",
              url: "/pictures/connection-error.svg",
            });
          });
      }
    }, 600000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (isReady) {
    if (error.message !== "") {
      return <ErrorMsg message={error.message} imgUrl={error.url} />;
    }
    return (
      <div>
        {window.location.pathname !== "/" && <Bar />}
        <Switch>
          <Route exact path="/" component={SignUpPage} />
          <Route exact path="/home" component={Homepage} />
          <Route exact path="/home/:tag" component={Homepage} />
          <Route
            exact
            path="/picture/:pictureId"
            render={(props) => <Content match={props.match} />}
          />
          <Route
            exact
            path="/profile/:name"
            render={(props) => <Profile match={props.match} />}
          />
          <Route exact path="/setting" component={() => <>setting</>} />
          <Route exact path="/logout" component={() => <>logout</>} />
        </Switch>
        <AlertDialog
          open={isDialogOpen}
          alertTitle="You are during bucket"
          alertDesciption={`End: ${format(
            addHours(new Date(user.BucketTime), 8),
            "yyyy-MM-dd hh:mm:ss"
          )}`}
          alertButton={
            <>
              <Button onClick={handleClose}>Got it!</Button>
            </>
          }
          onClose={handleClose}
        />
      </div>
    );
  }
  return <Loading />;
}
