import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { makeStyles, Avatar, Button } from "@material-ui/core";
import useIntersectionObserver from "./useIntersectionObserver";
import { CONCAT_SERVER_URL } from "../../../utils";

const useStyles = makeStyles(() => ({
  list: {
    position: "relative",
    display: "block",
    height: "400px",
    overflow: "auto",
  },
  divLike: {
    display: "block",
    padding: "0 24px 0 0",
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

export default function Followers(props) {
  const { name } = props;
  const classes = useStyles();
  const [list, setList] = useState([]);
  const loadMoreButtonRef = useRef();
  const {
    data,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    "projects",
    (key, nextId = 0) => {
      return axios
        .get(CONCAT_SERVER_URL("/api/v1/follows/followers"), {
          params: { name, nextId },
        })
        .then((response) => {
          return response.data;
        });
    },
    {
      getFetchMore: (lastGroup) => lastGroup.nextId,
    }
  );
  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchMore,
    enabled: canFetchMore,
  });
  useEffect(() => {
    if (isFetching === true) return;
    setList(
      data.map((page) =>
        page.message.map((value) => (
          <span className={classes.followerDiv} key={value.username}>
            {/**
              Avatar use div to display,so there will be some error
              such like : <div> cannot appear as a descendant of <p>.
            */}
            <Avatar
              alt={`${value.username}'s avatar`}
              className={classes.avatar}
              src={CONCAT_SERVER_URL(value.avatar_url)}
            />
            <span style={{ display: "block", width: "15px" }} />
            {value.username}
          </span>
        ))
      )
    );
  }, [name, data, isFetching]);
  return (
    <span className={classes.list}>
      {list}
      <span className={classes.divLike}>
        <Button
          ref={loadMoreButtonRef}
          onClick={() => fetchMore()}
          disabled={!canFetchMore}
        >
          {isFetchingMore
            ? "Loading more..."
            : canFetchMore
            ? "Load More"
            : "Nothing more to load"}
        </Button>
      </span>
    </span>
  );
}
