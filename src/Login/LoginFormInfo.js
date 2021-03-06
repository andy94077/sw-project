import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { setVerified, setId } from "../redux/userSlice";
import Loading from "../components/Loading";
import { setCookie } from "../cookieHelper";
import { CONCAT_SERVER_URL } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    '"& > *"': {
      margin: theme.spacing(1),
      width: '"25ch"',
    },
  },
  centerMargin: {
    margin: "0px auto 0px",
  },
  controlSpace: {
    marginTop: "10px",
    width: "300px",
    [`@media (max-width: 400px)`]: {
      width: "80%",
    },
  },
  controlButton: {
    marginTop: "30px",
    width: "200px",
    [`@media (max-width: 400px)`]: {
      width: "170px",
    },
  },
  visitorHref: {
    display: "block",
    marginTop: "80px",
    color: "gray",
  },
}));

export default function LoginFormInfo() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const [state, setState] = useState({
    isError: false,
    nowLoading: false,
    errorMes: ["", ""],
  });

  const handleChangeEmail = (e) => {
    setInfo({
      ...info,
      email: e.target.value,
    });
  };

  const handleChangePassword = (e) => {
    setInfo({
      ...info,
      password: e.target.value,
    });
  };

  const handleSubmit = () => {
    // Check if it is a valid input
    //
    setState({
      isError: state.isError,
      nowLoading: true,
      errorMes: state.errorMes,
    });

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    };
    const formdata = new FormData();
    formdata.append("email", info.email);
    formdata.append("password", info.password);
    // must remove before demo
    formdata.append("avatar_url", "/img/avatar.jpeg");
    //
    axios
      .post(CONCAT_SERVER_URL("/api/v1/user/logIn"), formdata, config)
      .then((response) => {
        if (response.data.isLogin) {
          setState({
            isError: false,
            nowLoading: false,
            errorMes: "",
          });
          if (response.data.token !== "")
            setCookie("accessToken", response.data.token, 1);
          const currentPath = history.location.pathname;
          if (response.data.verified) {
            dispatch(setVerified({ verified: true }));
            if (currentPath === "/") history.push("/home");
            else history.push(currentPath);
          } else {
            dispatch(setVerified({ verified: false }));
            dispatch(setId({ user_id: response.data.user_id }));
          }
        } else {
          setState({
            isError: true,
            nowLoading: false,
            errorMes: ["", "Email or Password is not found"],
          });
        }
      })
      .catch((error) => {
        if (error === null) return;
        setState({
          isError: true,
          nowLoading: false,
          errorMes: ["", "Connection fail"],
        });
      });
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={classes.centerMargin}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          value={info.email}
          label="Email"
          variant="outlined"
          required
          error={state.isError}
          helperText={state.errorMes[0]}
          placeholder="enter your email"
          color="primary"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
          onChange={handleChangeEmail}
        />

        <TextField
          type="password"
          value={info.password}
          label="Password"
          variant="outlined"
          required
          error={state.isError}
          helperText={state.errorMes[1]}
          placeholder="enter your password"
          color="primary"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
          onChange={handleChangePassword}
          onKeyUp={handleSearch}
        />

        {state.nowLoading ? (
          <Loading />
        ) : (
          <Button
            variant="contained"
            component="span"
            className={classes.controlButton}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        )}
        <a href="/home" className={classes.visitorHref}>
          <h1 style={{ fontSize: "20px" }}>---- I am a Guest ----</h1>
        </a>
      </form>
    </div>
  );
}
