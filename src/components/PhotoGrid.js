import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "./Loading";
import Photo from "./Photo";
import ErrorMsg from "./ErrorMsg";
import "./PhotoGrid.css";
import { CONCAT_SERVER_URL } from "../utils";

const useStyles = makeStyles(() => ({
  loading: {
    marginTop: "40px",
  },
}));

export default function PhotoGrid(props) {
  const { tag, userId, number = 120, showError = true } = props;
  const classes = useStyles();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState({ message: "", url: "" });
  const [imageListWithid, setImageListWithId] = useState([]);

  useEffect(() => {
    setIsReady(false);
    setError({ message: "", url: "" });
    const url =
      userId !== undefined && userId !== null
        ? CONCAT_SERVER_URL("/api/v1/post/user")
        : CONCAT_SERVER_URL("/api/v1/post/picture");
    axios
      .get(url, {
        params: { user_id: userId, number, tag },
      })
      .then((res) => {
        if (
          res.data.imageListWithId instanceof Array &&
          res.data.imageListWithId.length > 0
        )
          setImageListWithId(res.data.imageListWithId);
        else {
          setError({
            message: "No Image Found",
            url: "/pictures/no-image-found.png",
          });
        }
      })
      .catch(() => {
        if (showError === true) {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        }
      })
      .finally(() => setIsReady(true));
  }, [tag, number, userId, showError]);

  if (isReady) {
    if (error.message !== "") {
      return <ErrorMsg message={error.message} imgUrl={error.url} />;
    }
    return (
      <div className="grid">
        {imageListWithid.map(({ id, url }) => (
          <Link to={`/picture/${id}`} key={id}>
            <Photo
              image={url.split("/").slice(-1)[0]}
              src={CONCAT_SERVER_URL(url)}
            />
          </Link>
        ))}
      </div>
    );
  }
  return (
    <div className={classes.loading}>
      <Loading />
    </div>
  );
}
