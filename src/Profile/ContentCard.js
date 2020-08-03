import React, { useState, useRef } from "react";
import axios from "axios";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CardMedia, Card } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../constants";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    height: "75vh",
    boxShadow: "rgba(0,0,0,0.45) 0px 2px 10px",
    borderRadius: "30px 30px 0 0",
    overflow: "auto",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    flex: "50%",
    [theme.breakpoints.down("xs")]: {
      flex: "100%",
    },
  },
  cover: {
    minHeight: "540px",
    height: "100%",
    flex: "50%",
    [theme.breakpoints.down("xs")]: {
      flex: "100%",
      minHeight: "0px",
      height: "calc(100% - 200px)",
    },
    cursor: "zoom-in",
  },
  coverOpen: {
    height: "100%",
    flex: "100%",
    cursor: "zoom-out",
  },
  select: {
    margin: "20px",
    width: "40%",
  },
  textarea: {
    marginRight: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    minHeight: "400px",
    height: "100%",
    overflow: "auto",
  },
  textfield: {
    marginTop: "20px",
    marginLeft: "20px",
    height: "100%",
  },
  central: {
    position: "absolute",
    bottom: "30px",
    right: "20px",
  },
  rounded: {
    marginTop: "20px",
    width: "calc(40% - 10px)",
    borderRadius: "60px",
  },
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
  none: {
    color: "gray",
  },
  fail: {
    margin: "auto",
  },
}));

export default function ContentCard(props) {
  const { userId, username, src } = props;
  const classes = useStyles();
  const desc = useRef();
  const history = useHistory();

  const [tag, setTag] = useState("");
  const [empty, setEmpty] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  const handleSelectTag = (event) => {
    setEmpty(false);
    setTag(event.target.value);
  };

  const handleUploadDesc = () => {
    if (tag === "") {
      setEmpty(true);
      return;
    }

    const jsonData = {
      url: src,
      user_id: userId,
      username,
      content: desc.current.value,
      tag,
    };

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/profile/uploadDesc"),
        data: jsonData,
      })
      .then((res) => history.push(`/picture/${res.data.id}`))
      .catch((error) => console.log(error));
  };

  if (src !== "ERROR") {
    return (
      <Card className={classes.root}>
        {src === "" ? (
          <div className={classes.cover}>
            <CardMedia component={Loading} />
          </div>
        ) : (
          <CardMedia
            className={clsx(classes.cover, {
              [classes.coverOpen]: isCoverOpen,
            })}
            image={CONCAT_SERVER_URL(src)}
            title="Live from space album cover"
            onClick={() => {
              setIsCoverOpen(!isCoverOpen);
            }}
          />
        )}
        <div className={classes.details}>
          <FormControl
            variant="outlined"
            className={classes.select}
            error={empty}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Tag *
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={tag}
              onChange={handleSelectTag}
              label="Tag *"
            >
              <MenuItem value="">
                <em className={classes.none}>None</em>
              </MenuItem>
              <MenuItem value="cat">cat</MenuItem>
              <MenuItem value="dog">dog</MenuItem>
            </Select>
            {empty ? <FormHelperText>A tag is necessary</FormHelperText> : null}
          </FormControl>
          <FormControl>
            <Button
              variant="contained"
              color="secondary"
              className={`${classes.central} ${classes.rounded} ${classes.text}`}
              onClick={handleUploadDesc}
            >
              Submit
            </Button>
          </FormControl>
          <TextField
            id="outlined-start-adornment"
            className={classes.textfield}
            label="Image description"
            multiline
            rowsMax="19"
            variant="outlined"
            InputProps={{
              className: classes.textarea,
            }}
            inputRef={desc}
          />
        </div>
      </Card>
    );
  }
  return (
    <Card className={classes.root}>
      <Typography className={classes.fail} variant="h5" noWrap>
        <ErrorIcon /> Connection failed.
      </Typography>
    </Card>
  );
}
