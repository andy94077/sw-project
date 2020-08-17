import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Loading from "../components/Loading";
import { setCookie } from "../cookieHelper";
import { CONCAT_SERVER_URL } from "../utils";

const keyNote = {
  "name.required": "Username can't be empty",
  "name.unique": "This username is already registered",
  "name.max": "Username must be less than 64 characters",
  "name.alpha_num": "Username can't contain special characters",
  "email.required": "Email can't be empty",
  "email.email": "The email must be a valid email address.",
  "email.unique": "This email is already registered",
  "email.max": "Email must be less than 64 characters",
  "password.required": "Password  can't be empty",
  "password.regex": "Password must only contain number or alpha",
  "password.unique": "This password is already registered",
  "password.min": "Password must be at least 8 characters",
  "password.max": "Password must be less than 255 characters",
};

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
    marginTop: "20px",
    width: "200px",
    [`@media (max-width: 400px)`]: {
      width: "170px",
    },
  },
}));

export default function SignUpFormInfo() {
  const classes = useStyles();
  const history = useHistory();
  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [state, setState] = useState({
    isError: [false, false, false],
    nowLoading: false,
    errorMes: ["", "", ""],
  });

  const handleChangeUsername = (e) => {
    setInfo({
      ...info,
      username: e.target.value,
    });
  };

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

  const handleErrorUsername = (e) => {
    const inputUsername = e.target.value;
    if (/\s/.test(inputUsername) || inputUsername.length === 0) {
      setState((preState) => ({
        ...preState,
        isError: [true, preState.isError[1], preState.isError[2]],
        errorMes: [
          keyNote["name.required"],
          preState.errorMes[1],
          preState.errorMes[2],
        ],
      }));
    } else if (
      /^[a-zA-Z0-9\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+$/.test(
        inputUsername
      ) === false
    ) {
      setState((preState) => ({
        ...preState,
        isError: [true, preState.isError[1], preState.isError[2]],
        errorMes: [
          keyNote["name.alpha_num"],
          preState.errorMes[1],
          preState.errorMes[2],
        ],
      }));
    } else if (inputUsername.length > 64) {
      setState((preState) => ({
        ...preState,
        isError: [true, preState.isError[1], preState.isError[2]],
        errorMes: [
          keyNote["name.max"],
          preState.errorMes[1],
          preState.errorMes[2],
        ],
      }));
    } else {
      setState((preState) => ({
        ...preState,
        isError: [false, preState.isError[1], preState.isError[2]],
        errorMes: ["", preState.errorMes[1], preState.errorMes[2]],
      }));
    }
  };

  const handleErrorEmail = (e) => {
    const inputEmail = e.target.value;
    if (/\s/.test(inputEmail) || inputEmail.length === 0) {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], true, preState.isError[2]],
        errorMes: [
          preState.errorMes[0],
          keyNote["email.required"],
          preState.errorMes[2],
        ],
      }));
    } else if (
      /^[A-Za-z0-9_.-]+@[A-Za-z0-9_.-]+\.[A-Za-z]+$/.test(inputEmail) === false
    ) {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], true, preState.isError[2]],
        errorMes: [
          preState.errorMes[0],
          keyNote["email.email"],
          preState.errorMes[2],
        ],
      }));
    } else if (inputEmail.length > 64) {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], true, preState.isError[2]],
        errorMes: [
          preState.errorMes[0],
          keyNote["email.max"],
          preState.errorMes[2],
        ],
      }));
    } else {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], false, preState.isError[2]],
        errorMes: [preState.errorMes[0], "", preState.errorMes[2]],
      }));
    }
  };

  const handleErrorPassword = (e) => {
    const inputPassword = e.target.value;
    if (/\s/.test(inputPassword) || inputPassword.length === 0) {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], preState.isError[1], true],
        errorMes: [
          preState.errorMes[0],
          preState.errorMes[1],
          keyNote["password.required"],
        ],
      }));
    } else if (inputPassword.length < 8) {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], preState.isError[1], true],
        errorMes: [
          preState.errorMes[0],
          preState.errorMes[1],
          keyNote["password.min"],
        ],
      }));
    } else if (/^[A-Za-z0-9]+$/.test(inputPassword) === false) {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], preState.isError[1], true],
        errorMes: [
          preState.errorMes[0],
          preState.errorMes[1],
          keyNote["password.regex"],
        ],
      }));
    } else if (inputPassword.length > 64) {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], preState.isError[1], true],
        errorMes: [
          preState.errorMes[0],
          preState.errorMes[1],
          keyNote["password.max"],
        ],
      }));
    } else {
      setState((preState) => ({
        ...preState,
        isError: [preState.isError[0], preState.isError[1], false],
        errorMes: [preState.errorMes[0], preState.errorMes[1], ""],
      }));
    }
  };

  const handleSubmit = () => {
    // Check if it is a valid input
    //
    setState({
      isError: [false, false, false],
      nowLoading: true,
      errorMes: ["", "", ""],
    });

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    };
    const formdata = new FormData();
    formdata.append("name", info.username);
    formdata.append("email", info.email);
    formdata.append("password", info.password);
    // must remove before demo
    formdata.append("avatar_url", "/img/avatar.jpeg");
    //
    axios
      .post(CONCAT_SERVER_URL("/api/v1/user/register"), formdata, config)
      .then((response) => {
        if (response.data.isSignUp) {
          setState({
            isError: [false, false, false],
            nowLoading: false,
            errorMes: ["", "", ""],
          });
          if (response.data.isLogin) {
            setCookie("accessToken", response.data.token, 1);
            if (history.location.pathname === "/") history.push("/home");
          }
        } else {
          setState({
            isError: [
              response.data.isContentInvalid.name,
              response.data.isContentInvalid.email,
              response.data.isContentInvalid.password,
            ],
            nowLoading: false,
            errorMes: [
              response.data.isContentInvalid.name === true
                ? response.data.errorMesContent.name
                : "",
              response.data.isContentInvalid.email === true
                ? response.data.errorMesContent.email
                : "",
              response.data.isContentInvalid.password === true
                ? response.data.errorMesContent.password
                : "",
            ],
          });
        }
      })
      .catch((error) => {
        if (error === null) return;
        setState({
          isError: [true, true, true],
          nowLoading: false,
          errorMes: ["", "", "connection fail"],
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
          value={info.username}
          label="User Name"
          variant="outlined"
          required
          error={state.isError[0]}
          helperText={state.errorMes[0]}
          placeholder="enter your username"
          color="primary"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
          onChange={handleChangeUsername}
          onBlur={handleErrorUsername}
        />

        <TextField
          value={info.email}
          label="Email"
          variant="outlined"
          required
          error={state.isError[1]}
          helperText={state.errorMes[1]}
          placeholder="enter your email"
          color="primary"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
          onChange={handleChangeEmail}
          onBlur={handleErrorEmail}
        />

        <TextField
          type="password"
          value={info.password}
          label="Password"
          variant="outlined"
          required
          error={state.isError[2]}
          helperText={state.errorMes[2]}
          placeholder="enter your password"
          color="primary"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
          onChange={handleChangePassword}
          onBlur={handleErrorPassword}
          onKeyUp={handleSearch}
        />

        {state.nowLoading ? (
          <Loading />
        ) : (
          <Button
            variant="contained"
            className={classes.controlButton}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        )}
      </form>
    </div>
  );
}
