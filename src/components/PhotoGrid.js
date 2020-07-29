import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Loading from "./Loading";
import Photo from "./Photo";
import "./PhotoGrid.css";

export default function PhotoGrid(props) {
  const { tag, number = 12 } = props;
  const [isReady, setIsReady] = useState(false);
  const [imageList, setImageList] = useState();

  useEffect(() => {
    axios
      .get("http://pinterest-server.test/api/v1/get/picture", {
        params: { tag, number },
      })
      .then((res) => {
        setImageList(res.data.imageListWithId.map((value) => value.url));
        setIsReady(true);
      })
      .catch(() => alert("error"));
  }, [tag, number]);

  let photos;
  if (isReady) {
    photos = imageList.map((image) => (
      <Link to={`/picture/${image.split("/").slice(-3, -2)[0]}`} key={image}>
        <Photo image={image.split("/").slice(-1)[0]} src={image} />
      </Link>
    ));
  }

  return <div className="grid">{isReady ? photos : <Loading />}</div>;
}
