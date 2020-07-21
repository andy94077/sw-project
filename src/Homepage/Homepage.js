import React from "react";

import PhotoGrid from "../components/PhotoGrid";

export default function Homepage(props) {
  const { imageList } = props;
  return <PhotoGrid imageList={imageList} />;
}
