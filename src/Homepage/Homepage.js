import React from "react";
import { Container, CssBaseline } from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";
import Bar from "../Bar/Bar";

export default function Homepage({ match }) {
  const { tag } = match.params;

  return (
    <div>
      <Bar />
      <Container maxWidth="lg">
        <CssBaseline />
        <PhotoGrid tag={tag} />
      </Container>
    </div>
  );
}
