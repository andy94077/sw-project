import React from "react";
import { Link } from "react-router-dom";

import Photo from "./Photo";
import "./PhotoGrid.css";

export default function PhotoGrid(props) {
  const { imageList } = props;

  const photos = imageList.map((image) => (
    <Link to={`/picture/${image}`} key={image}>
      <Photo image={image} src={image} />
    </Link>
  ));

  return <div className="grid">{photos}</div>;
}
