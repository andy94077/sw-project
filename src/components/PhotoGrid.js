import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Loading from "./Loading";
import Photo from "./Photo";
import "./PhotoGrid.css";

export default function PhotoGrid(props) {
  const { tag, number = 120 } = props;
  const [isReady, setIsReady] = useState(false);
  const [imageListWithid, setImageListWithId] = useState();

  useEffect(() => {
    axios
      .get("http://pinterest-server.test/api/v1/get/picture", {
        params: { tag, number },
      })
      .then((res) => {
        setImageListWithId(res.data.imageListWithId);
        setIsReady(true);
      })
      .catch(() => alert("error"));
  }, [tag, number]);

  let photos;
  if (isReady) {
    photos = imageListWithid.map(({ id, url }) => (
      <Link to={`/picture/${id}`} key={id}>
        <Photo image={url.split("/").slice(-1)[0]} src={url} />
      </Link>
    ));
  }

  return <div className="grid">{isReady ? photos : <Loading />}</div>;
}
