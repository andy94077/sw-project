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
  const [count, setCount] = useCountDown(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnection, setIsConnection] = useState(true);
  const [value, setValue] = useState("");
  const [time, setTime] = useState(null);
  const user = useSelector(selectUser);

  function handleSubmit() {
    if (value !== "" && count < 0) {
      const t = Date.now() + 60000;
      axios
        .post(CONCAT_SERVER_URL("/api/v1/users/verify"), {
          time: t,
          user_id: user.userId,
        })
        .then(() => {
          setTime(t);
        })
        .catch(() => {
          setIsConnection(false);
        })
        .finally(() => {
          setValue("");
        });
    }
  }

  function handleClick(e) {
    e.preventDefault();
    handleSubmit();
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/times")
      .then((res) => {
        setTime(res.data.time);
        setIsLoading(false);
      })
      .catch(() => {
        setIsConnection(false);
      });
  }, []);

  useEffect(() => {
    if (time !== null && time > Date.now()) {
      setCount(Math.floor((time - Date.now()) / 1000));
    }
  }, [time]);

  if (!isConnection) return <div>Connection failed</div>;
  if (isLoading) return <Loading />;
  return (
    <>
      <form onSubmit={handleClick}>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
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
