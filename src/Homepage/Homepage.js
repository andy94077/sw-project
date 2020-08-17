import React, { useEffect } from "react";
import { Container, CssBaseline } from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";

export default function Homepage(props) {
  const {
    match: {
      params: { tag },
    },
  } = props;

  useEffect(() => {
    document.title = "賭ケグルイホームページ";
  }, []);

  return (
    <div>
      <Container maxWidth="lg">
        <CssBaseline />
        <PhotoGrid tag={tag} />
      </Container>
    </div>
  );
}
