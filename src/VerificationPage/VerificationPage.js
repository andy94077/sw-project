import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import useCountDown from "./useCountDown";
import SubmitButtom from "../components/SubmitButtom";
import TimeOutButtom from "../components/TimeOutButtom";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../utils";
import { selectUser } from "../redux/userSlice";

export default function VerificationPage() {
  const [count, setCount] = useCountDown();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnection, setIsConnection] = useState(true);
  const [code, setCode] = useState("");
  const [time, setTime] = useState(null);
  const user = useSelector(selectUser);

  function handleSubmit() {
    if (code !== "" && count < 0) {
      const t = Date.now() + 60000;
      setTime(t);
      axios
        .post(CONCAT_SERVER_URL("/api/v1/users/verify"), {
          time: t,
          user_id: user.userId,
          code,
        })
        .then(() => {})
        .catch(() => {
          setIsConnection(false);
        })
        .finally(() => {
          setCode("");
        });
    }
  }

  useEffect(() => {
    if (time !== null && time > Date.now()) {
      setCount(Math.floor((time - Date.now()) / 1000));
    }
  }, [time]);

  const handleClick = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  useEffect(() => {
    axios
      .get(CONCAT_SERVER_URL(`/api/v1/users/verifytime/1`))
      .then((res) => {
        setTime(res.data.time);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsConnection(false);
      });
  }, []);

  if (!isConnection) return <div>Connection failed</div>;
  if (isLoading) return <Loading />;
  return (
    <>
      <form onSubmit={handleClick}>
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        {count >= 0 ? (
          <TimeOutButtom count={count} />
        ) : (
          <SubmitButtom type="submit" />
        )}
      </form>
    </>
  );
}
