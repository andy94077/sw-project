import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Loading from "../components/Loading";
import { setCookie } from "../cookieHelper";

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
  },
  controlButton: {
    marginTop: "50px",
    width: "200px",
  },
}));

export default function LoginFormInfo() {
  const classes = useStyles();
  const username = useRef();
  const password = useRef();
  const history = useHistory();

  const [state, setState] = useState({
    username: "",
    isError: false,
    nowLoading: false,
    errorMes: "",
  });

  const handleSubmit = () => {
    setState({
      username: username.current.value,
    });
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
    formdata.append("name", username.current.value);
    formdata.append("email", username.current.value);
    formdata.append("password", password.current.value);
    // must remove before demo
    formdata.append("avatar_url", "/img/avatar.jpeg");
    //
    axios
      .post("http://pinterest-server.test/api/v1/user/logIn", formdata, config)
      .then((response) => {
        if (response.data.isLogin) {
          alert(response.data.Message);
          setState({
            isError: false,
            nowLoading: false,
          });
          setCookie("userToken", response.data.token, 1);
          history.push("/home");
        } else {
          alert(response.data.Message);
          setState({
            isError: true,
            nowLoading: false,
            errorMes: "username or password is not found",
          });
        }
      })
      .catch((error) => {
        if (error === null) return;
        setState({
          isError: true,
          nowLoading: false,
          errorMes: "connection fail",
        });
      });
  };

  return (
    <div className={classes.centerMargin}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          inputRef={username}
          label="User Name"
          variant="outlined"
          required
          error={state.isError}
          helperText={state.errorMes}
          placeholder="enter your username"
          color="primary"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
        />

        <TextField
          type="password"
          inputRef={password}
          label="Password"
          variant="outlined"
          required
          error={state.isError}
          helperText={state.errorMes}
          placeholder="enter your password"
          color="primary"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
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
