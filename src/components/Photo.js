import React, { useState } from "react";
import { GridListTileBar, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles({
  root: {
    position: "relative",
  },
  icon: {
    color: "#eeeeee",
  },
});

export default function Photo(props) {
  const classes = useStyles();
  const [barVisibility, setBarVisibility] = useState(false);
  const { image, src } = props;

  const changeBarVisibility = () => setBarVisibility(!barVisibility);

  return (
    <div
      className={classes.root}
      onMouseEnter={changeBarVisibility}
      onMouseLeave={changeBarVisibility}
    >
      <img src={src} alt={image} style={{ width: "100%", height: "auto" }} />
      {barVisibility && (
        <GridListTileBar
          title={image}
          actionIcon={
            <IconButton
              aria-label={`info about ${image}`}
              className={classes.icon}
            >
              <InfoIcon />
            </IconButton>
          }
        />
      )}
    </div>
  );
}
