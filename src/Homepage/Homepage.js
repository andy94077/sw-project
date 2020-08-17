import React, { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  Select,
  MenuItem,
  makeStyles,
  FormControl,
} from "@material-ui/core";

import PhotoGrid from "../components/PhotoGrid";

const useStyles = makeStyles(() => ({
  select: {
    marginLeft: "40px",
  },
  formControl: {
    margin: "5px",
    minWidth: 120,
  },
}));

export default function Homepage(props) {
  const {
    match: {
      params: { tag },
    },
  } = props;
  const [order, setOrder] = useState({ order: "id", sequence: "asc" });
  const classes = useStyles();
  useEffect(() => {
    document.title = "賭ケグルイホームページ";
  }, []);

  return (
    <div>
      <div className={classes.select}>
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            value={order.order}
            onChange={(e) => {
              setOrder((preOrder) => ({
                order: e.target.value,
                sequence: preOrder.sequence,
              }));
            }}
          >
            <MenuItem value="id">id</MenuItem>
            <MenuItem value="like">like</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            value={order.sequence}
            onChange={(e) => {
              setOrder((preOrder) => ({
                order: preOrder.order,
                sequence: e.target.value,
              }));
            }}
          >
            <MenuItem value="desc">desc</MenuItem>
            <MenuItem value="asc">asc</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Container maxWidth="lg">
        <CssBaseline />
        <PhotoGrid tag={tag} order={order} />
      </Container>
    </div>
  );
}
