import React from "react";

import Photo from "./Photo";
import "./PhotoGrid.css";

export default function PhotoGrid(props) {
  const { imageList, handleSetState } = props;

  const photos = imageList.map((image) => (
    <Photo
      key={image}
      image={image}
      src={`images/${image}`}
      onClick={handleSetState({
        tabIndex: "Content",
        ContentSrc: `images/${image}`,
      })}
    />
  ));

  return <div className="grid">{photos}</div>;
}
