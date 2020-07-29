import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Loading from "./Loading";
import Photo from "./Photo";
import "./PhotoGrid.css";

export default function PhotoGrid(props) {
  const { tag, userId, number = 120 } = props;
  const [isReady, setIsReady] = useState(false);
  const [imageListWithid, setImageListWithId] = useState();

  useEffect(() => {
    setIsReady(false);
    const url =
      userId !== undefined && userId !== null
        ? "http://pinterest-server.test/api/v1/post/user"
        : "http://pinterest-server.test/api/v1/post/picture";
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
