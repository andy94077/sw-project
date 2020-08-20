import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles, Avatar } from "@material-ui/core";
import { CONCAT_SERVER_URL } from "../../../utils";

const useStyles = makeStyles(() => ({
  list: {
    position: "relative",
    maxHeight: "400px",
    overflow: "auto",
  },
  followerDiv: {
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "10px",
    fontSize: "25px",
  },
  avatar: {
    width: "45px",
    height: "45px",
  },
}));

export default function Followings(props) {
  const { name } = props;
  const classes = useStyles();
  const [list, setList] = useState([]);
  useEffect(() => {
    axios
      .get(CONCAT_SERVER_URL("/api/v1/follows/followings"), {
        params: { name },
      })
      .then((response) => {
        setList(
          response.data.map((value) => (
            <>
              <span className={classes.followerDiv} key={value.username}>
                <Avatar
                  alt={`${value.username}'s avatar`}
                  className={classes.avatar}
                  src={CONCAT_SERVER_URL(value.avatar_url)}
                />
                <div style={{ width: "15px" }} />
                {value.username}
              </span>
              <span className={classes.followerDiv} key={value.username}>
                <Avatar
                  alt={`${value.username}'s avatar`}
                  className={classes.avatar}
                  src={CONCAT_SERVER_URL(value.avatar_url)}
                />
                <div style={{ width: "15px" }} />
                {value.username}
              </span>
            </>
          ))
        );
      });
  }, [name]);
  return <div className={classes.list}>{list}</div>;
}
