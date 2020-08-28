import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField } from "@material-ui/core";

import useCountDown from "./useCountDown";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../utils";
import { setCookie } from "../cookieHelper";
import { selectUser, setVerified } from "../redux/userSlice";

export default function VerificationPage() {
  const history = useHistory();
  const [count, setCount] = useCountDown();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnection, setIsConnection] = useState(true);
  const [code, setCode] = useState("");
  const [time, setTime] = useState(null);
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);

  const handleCodeChange = (e) => setCode(e.target.value);

  const handleClick = () => {
    if (code === "") return;

    const t = Date.now() + 5000;
    setTime(t);
    axios
      .post(CONCAT_SERVER_URL("/api/v1/users/verify"), {
        time: t,
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
          console.log(error.response.data);
        } else setIsConnection(false);
      })
      .finally(() => {
        setCode("");
      });
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") handleClick();
  };

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
      .catch((e) => {
        console.log(e);
        setIsConnection(false);
      });
  }, [userId]);

  if (!isConnection) return <div>Connection failed</div>;
  if (isLoading) return <Loading />;
  return (
    <>
      <TextField
        label="verification code"
        value={code}
        onChange={handleCodeChange}
        onKeyUp={handleKeyUp}
      />
      {count > 0 ? (
        <Button variant="contained" color="primary">
          {`${count} s`}
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleClick}>
          Submit
        </Button>
      )}
    </>
  );
}
