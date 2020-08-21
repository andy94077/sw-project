import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { makeStyles, Avatar, Button } from "@material-ui/core";
import { selectUser } from "../../../redux/userSlice";
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
  },
  followerDiv: {
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "25px",
    fontSize: "20px",
    "&:hover": {
      backgroundColor: `rgb(240,240,240)`,
    },
    outline: "none",
  },
  avatar: {
    width: "45px",
    height: "45px",
  },
}));

export default function Followings(props) {
  const { name } = props;
  const classes = useStyles();
  const loadMoreButtonRef = useRef();
  const history = useHistory();
  const { userId } = useSelector(selectUser);
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
        .get(CONCAT_SERVER_URL("/api/v1/follows/followings"), {
          params: { name, nextId, viewer_id: userId },
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
  const handleSearch = (target) => () => {
    history.push(`/profile/${target}`);
  };
  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  useEffect(() => {
    if (isFetching === false) {
      // data.map((page) =>
      //   page.message.map((value) => (
      //     <span
      //       className={classes.followerDiv}
      //       key={value.username}
      //       role="button"
      //       tabIndex="0"
      //       onClick={handleSearch(value.username)}
      //       onKeyUp={handleKeyUp}
      //     >
      //       {/**
      //         Avatar use div to display,so there will be some error
      //         such like : <div> cannot appear as a descendant of <p>.
      //       */}
      //       <Avatar
      //         alt={`${value.username}'s avatar`}
      //         className={classes.avatar}
      //         src={CONCAT_SERVER_URL(value.avatar_url)}
      //       />
      //       <span style={{ display: "block", width: "15px" }} />
      //       {value.username}
      //     </span>
      //   ))
      // )
    }
  }, [data, isFetching]);

  return (
    <span className={classes.list}>
      {isFetching
        ? null
        : data.map((page) =>
            page.message.map((value) => (
              <span
                className={classes.followerDiv}
                key={value.username}
                role="button"
                tabIndex="0"
                onClick={handleSearch(value.username)}
                onKeyUp={handleKeyUp}
              >
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
          )}
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
