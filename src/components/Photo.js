import React, { useState } from "react";
import { GridListTileBar, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles({
  root: {
    position: "relative",
    borderRadius: "20px",
    margin: "0 7px 20px 7px",
  },
  icon: {
    color: "#eeeeee",
  },
  bar: {
    borderRadius: "0 0 20px 20px",
  },
});

export default function Photo(props) {
  const classes = useStyles();
  const [barVisibility, setBarVisibility] = useState(false);
  const { image, src, onClick } = props;

  const onKeyUp = (e) => {
    if (e.key === "Enter") onClick();
  };
  const changeBarVisibility = () => setBarVisibility(!barVisibility);

  return (
    <div
      className={classes.root}
      onMouseEnter={changeBarVisibility}
      onMouseLeave={changeBarVisibility}
      onClick={onClick}
      onKeyUp={onKeyUp}
      role="button"
      tabIndex="0"
    >
      <img
        src={src}
        alt={image}
        style={{ width: "100%", height: "auto", borderRadius: "inherit" }}
      />
      {barVisibility && (
        <GridListTileBar
          className={classes.bar}
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
