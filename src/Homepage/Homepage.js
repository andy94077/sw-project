import React from "react";
import { Container, CssBaseline } from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";
import Bar from "../Bar/Bar";

export default function Homepage({ match }) {
  const { tag } = match.params;
  console.log(tag);
  return (
    <>
      <Bar />
      <Container maxWidth="lg">
        <CssBaseline />
        <PhotoGrid
          imageList={Array.from({ length: 12 }, (_, i) => `${i + 1}`)}
        />
      </Container>
    </>
  );
}
