import React from "react";

export default function Photo(props) {
  const { image, src } = props;

  return (
    <img src={src} alt={image} style={{ width: "100%", height: "auto" }} />
  );
}
