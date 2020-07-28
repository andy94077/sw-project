import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, CssBaseline } from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";
import Loading from "../components/Loading";
import Bar from "../Bar/Bar";

export default function Homepage({ match }) {
  const { tag } = match.params;

  const [isReady, setIsReady] = useState(false);
  const [imageList, setImageList] = useState();
  // let imageList; // = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  useEffect(() => {
    axios
      .get("http://pinterest-server.test/api/v1/get/picture", {
        params: { tag, number: 12 },
      })
      .then((res) => {
        setImageList(res.data.imageListWithId.map((value) => value.url));
        // console.log(imageList, "hi");
        setIsReady(true);
      })
      .catch(() => alert("error"));
  }, [tag]);

  // console.log(imageList);
  return (
    <div>
      <Bar />
      <Container maxWidth="lg">
        <CssBaseline />
        {isReady ? <PhotoGrid imageList={imageList} /> : <Loading />}
      </Container>
    </div>
  );
}
