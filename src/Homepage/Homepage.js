import React from "react";
import { Container, CssBaseline } from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";

export default function Homepage(props) {
  const { imageList, handleSetState } = props;

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <PhotoGrid imageList={imageList} handleSetState={handleSetState} />
    </Container>
  );
}
