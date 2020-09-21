import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField } from "@material-ui/core";

import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../utils";
import { setCookie } from "../cookieHelper";
import { selectUser, setVerified } from "../redux/userSlice";
import "./App.css";

const useStyles = makeStyles(() => ({
  frame: {
    padding: "40px 0 20px 0",
  },
  controlSpace: {
    marginTop: "10px",
    width: "300px",
    [`@media (max-width: 400px)`]: {
      width: "80%",
    },
  },
  buttonFrame: {
    position: "relative",
    height: "65px",
    marginTop: "20px",
  },
  submit: {
    position: "absolute",
    right: "180px",
    margin: "auto 20px",
    fontSize: "16px",
  },
  resend: {
    position: "absolute",
    right: "18px",
    width: "150px",
    fontSize: "16px",
  },
}));

export default function VerificationPage(props) {
  const { count, setCount, setIsWait } = props;
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnection, setIsConnection] = useState(true);
  const [code, setCode] = useState("");
  const [time, setTime] = useState(null);
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);
  const [state, setState] = useState({ isError: false, errorMes: "" });

  const handleCodeChange = (e) => setCode(e.target.value);

  const handleSubmit = () => {
    if (code === "") return;

    // const t = Date.now() + 5000;
    // setTime(t);
    axios
      .post(CONCAT_SERVER_URL("/api/v1/users/verify"), {
        // time: t,
        user_id: userId,
        code,
      })
      .then((response) => {
        setCookie("accessToken", response.data.token, 1);
        dispatch(setVerified({ verified: true }));
        history.push("/home");
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          // error verification code
          setState({ isError: true, errorMes: "Uncorrect Verification Code" });
        } else setIsConnection(false);
      })
      .finally(() => {
        setCode("");
      });
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleResend = () => {
    const t = Date.now() + 20000;
    setTime(t);
    axios
      .post(CONCAT_SERVER_URL(`/api/v1/users/resend/${userId}`), { time: t })
      .catch(() => setIsConnection(false))
      .finally(() => setCode(""));
  };

  useEffect(() => {
    if (count <= 0) setIsWait(false);
    else setIsWait(true);
  }, [count]);

  useEffect(() => {
    if (time !== null && time > Date.now()) {
      setCount(Math.floor((time - Date.now()) / 1000));
    }
  }, [time]);

  useEffect(() => {
    if (userId === null) return;
    axios
      .get(CONCAT_SERVER_URL(`/api/v1/users/verifytime/${userId}`))
      .then((res) => {
        setTime(res.data.time);
        setIsLoading(false);
      })
      .catch(() => {
        setIsConnection(false);
      });
  }, [userId]);

  if (!isConnection) return <div>Connection failed</div>;
  if (isLoading) return <Loading />;
  return (
    <div className={classes.frame}>
      <div>
        <TextField
          label="verification code"
          value={code}
          required
          error={state.isError}
          helperText={state.errorMes}
          placeholder="Please enter code"
          className={classes.controlSpace}
          InputProps={{ style: { borderRadius: "50px" } }}
          onChange={handleCodeChange}
          onKeyUp={handleKeyUp}
        />
      </div>
      <div className={classes.buttonFrame}>
        <Button
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          color="primary"
          className={classes.resend}
          disabled={count > 0}
          onClick={handleResend}
        >
          {count <= 0 ? "Resend " : `Resend (${count}s)`}
        </Button>
      </div>
    </div>
  );
}
