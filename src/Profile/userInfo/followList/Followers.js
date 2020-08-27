import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { makeStyles, Avatar, Button } from "@material-ui/core";
import { selectUser } from "../../../redux/userSlice";
import useIntersectionObserver from "./useIntersectionObserver";
import { CONCAT_SERVER_URL } from "../../../utils";
import FollowButton from "../../upload_follow/FollowButton";

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
  button: {
    display: "flex",
    width: "90px",
    fontSize: "13px",
    textAlign: "center",
    margin: "auto 7% auto auto",
    height: "30px",
  },
}));

export default function Followers(props) {
  const { name } = props;
  const classes = useStyles();
  const loadMoreButtonRef = useRef();
  const { userId } = useSelector(selectUser);
  const [currentState, setCurrentState] = useState();
  const history = useHistory();
  const {
    data = [],
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery(
    "projects",
    (key, nextId = 0) => {
      return axios
        .get(CONCAT_SERVER_URL("/api/v1/follows/followers"), {
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

  const statement = Array.from({ length: 8 }, (_, index) => {
    if (index > 3) return "Loading more...";
    if (index > 1) return "Loading...";
    if (index > 0) return "Load More";
    return "Nothing more to load";
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
    setCurrentState(
      (Number(isFetchingMore) << 2) +
        (Number(isFetching) << 1) +
        Number(canFetchMore)
    );
  }, [isFetchingMore, isFetching, canFetchMore]);

  return (
    <span className={classes.list}>
      {data.map((page) =>
        page.message.map((value) => (
          <span
            className={classes.followerDiv}
            key={value.username}
            role="button"
            tabIndex="0"
            onClick={handleSearch(value.username)}
            onKeyUp={handleKeyUp}
          >
            <Avatar
              alt={`${value.username}'s avatar`}
              className={classes.avatar}
              src={CONCAT_SERVER_URL(value.avatar_url)}
            />
            <span style={{ display: "block", width: "15px" }} />
            {value.username}
            {value.isFollow === false && value.id !== userId && (
              <FollowButton id={value.id} style={classes.button} />
            )}
          </span>
        ))
      )}
      <span className={classes.divLike}>
        <Button
          ref={loadMoreButtonRef}
          onClick={() => fetchMore()}
          disabled={!canFetchMore}
        >
          {statement[currentState]}
        </Button>
      </span>
    </span>
  );
}
