import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Loading from "../components/Loading";

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
    marginTop: "30px",
    width: "200px",
  },
}));

export default function SignUpFormInfo() {
  const classes = useStyles();
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
    formdata.append("name", info.username);
    formdata.append("email", info.email);
    formdata.append("password", info.password);
    // must remove before demo
    formdata.append("avatar_url", "/img/avatar.jpeg");
    //
    axios
      .post(
        "http://pinterest-server.test/api/v1/user/register",
        formdata,
        config
      )
      .then((response) => {
        if (response.data.isSignUp) {
          alert(response.data.Message);
          setState({
            isError: [false, false, false],
            nowLoading: false,
            errorMes: ["", "", ""],
          });
        } else {
          alert(response.data.Message);
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
    setInfo({
      username: "",
      email: "",
      password: "",
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
