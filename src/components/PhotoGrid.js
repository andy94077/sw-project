import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import Loading from "./Loading";
import Photo from "./Photo";
import "./PhotoGrid.css";
import { CONCAT_SERVER_URL } from "../constants";

const useStyles = makeStyles(() => ({
  loading: {
    marginTop: "40px",
  },
  noImage: {
    marginTop: "80px",
    color: "#707070",
  },
}));

export default function PhotoGrid(props) {
  const { tag, userId, number = 120 } = props;
  const classes = useStyles();
  const [isReady, setIsReady] = useState(false);
  const [imageListWithid, setImageListWithId] = useState();

  useEffect(() => {
    setIsReady(false);
    const url =
      userId !== undefined && userId !== null
        ? CONCAT_SERVER_URL("/api/v1/post/user")
        : CONCAT_SERVER_URL("/api/v1/post/picture");
    axios
      .get(url, {
        params: { user_id: userId, number, tag },
      })
      .then((res) => {
        setImageListWithId(res.data.imageListWithId);
        setIsReady(true);
      })
      .catch((res) => console.log(res));
  }, [tag, number, userId]);

  if (isReady) {
    if (imageListWithid.length === 0) {
      return (
        <Typography
          className={classes.noImage}
          align="center"
          variant="h4"
          display="block"
        >
          No Images Found
        </Typography>
      );
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
