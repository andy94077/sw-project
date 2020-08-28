import React, { useState, useEffect } from "react";
import axios from "axios";
import useCountDown from "./useCountDown";
import SubmitButtom from "../components/SubmitButtom";
import TimeOutButtom from "../components/TimeOutButtom";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../utils";

export default function VerificationPage() {
  const [count, setCount] = useCountDown();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnection, setIsConnection] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    axios
      .get(CONCAT_SERVER_URL("/api/v1/users/verify"), {
        params: { user: "Andy" },
      })
      .then(() => {
        setCount(10);
      })
      .catch(() => {
        setIsConnection(false);
      })
      .finally(() => {
        // eslint-disable-next-line prefer-const
        // let temp = list.slice();
        // temp.push(message);
        // setList(temp);
        setMessage("");
      });
  };

  const handleClick = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  useEffect(() => {
    axios
      .get(CONCAT_SERVER_URL("/api/v1/users/verify/times"), {
        params: { id: 1 },
      })
      .then((response) => {
        const value =
          response.data.time - parseInt(new Date().getTime() / 1000, 10);
        if (value > 0) setCount(value);
        setIsLoading(false);
      })
      .catch(() => {
        setIsConnection(false);
      });
  }, []);

  if (!isConnection) return <div>Connection failed</div>;
  if (isLoading) return <Loading />;
  return (
    <>
      <form onSubmit={handleClick}>
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
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
