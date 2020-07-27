import React from "react";
import { Container, CssBaseline } from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";

export default function Homepage() {
  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <PhotoGrid imageList={Array.from({ length: 12 }, (_, i) => `${i + 1}`)} />
    </Container>
  );
}
