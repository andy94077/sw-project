import React from "react";

import Photo from "./Photo";
import "./PhotoGrid.css";

export default function PhotoGrid(props) {
  const { imageList } = props;

  const photos = imageList.map((image) => (
    <Photo key={image} image={image} src={`images/${image}`} cols={1} />
  ));

  return <div className="grid">{photos}</div>;
}
