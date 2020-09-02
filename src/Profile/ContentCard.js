import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import {
  Button,
  CardMedia,
  Card,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";

import { CONCAT_SERVER_URL } from "../utils";
import Errormsg from "../components/ErrorMsg";
import Loading from "../components/Loading";
import MyQuill from "../components/MyQuill";
import { setDialog } from "../redux/dialogSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
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
  load: {
    position: "absolute",
    width: "50%",
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      minHeight: "0px",
      height: "calc(100% - 200px)",
    },
  },
  loadOpen: {
    width: "100%",
  },
  cover: {
    minHeight: "540px",
    height: "100%",
    flex: "50%",
    cursor: "zoom-in",
    [theme.breakpoints.down("xs")]: {
      flex: "100%",
      minHeight: "0px",
      height: "calc(100% - 200px)",
    },
    zIndex: "1111",
  },
  coverOpen: {
    flex: "100%",
    cursor: "zoom-out",
    [theme.breakpoints.down("xs")]: {
      height: "100%",
    },
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
    display: "block",
  },
  descLoad: {
    position: "absolute",
    bottom: "30px",
    right: "75px",
  },
}));

export default function ContentCard(props) {
  const { userId, username, src } = props;
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const [tag, setTag] = useState("");
  const [newTag, setNewTag] = useState({
    select: false,
    value: "",
  });
  const [allTags, setAllTags] = useState(null);
  const [isTagReady, setIsTagReady] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isReady, setIsReady] = useState("");

  useEffect(() => {
    setIsReady(src === "Error" ? "Error" : "Init");
  }, [src]);

  useEffect(() => {
    const jsonData = {
      start: 0,
      number: 10,
    };

    axios
      .request({
        method: "GET",
        url: CONCAT_SERVER_URL("/api/v1/tags"),
        params: jsonData,
      })
      .then((res) => setAllTags(res.data.tags));
  }, []);

  useEffect(() => {
    if (allTags !== null) setIsTagReady(true);
  }, [allTags]);

  const handleSelectTag = (event) => {
    setEmpty(false);
    setTag(event.target.value);
  };

  const handleSetNewTag = () => {
    setTag(newTag.value);
    setNewTag((state) => ({ ...state, select: true }));
  };

  const handleNewTagOK = () => {
    setNewTag({ select: false, value: tag });
  };

  const handleUploadDesc = () => {
    if (tag === "") {
      setEmpty(true);
      return;
    }
    setIsReady("Loading");

    const jsonData = {
      url: src,
      user_id: userId,
      username,
      content: value,
      tag,
    };

    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/profile/uploadDesc"),
        data: jsonData,
      })
      .then((res) => history.push(`/picture/${res.data.id}`))
      .catch((e) => {
        if (e.message === "Request failed with status code 403") {
          dispatch(
            setDialog({
              title: "Bucket Error",
              message: "You cannot send comment when you in the bucket",
            })
          );
        } else {
          setIsReady("Error");
        }
      });
  };

  if (isReady !== "Error") {
    return (
      <Card className={classes.root}>
        <div
          className={clsx(classes.load, {
            [classes.loadOpen]: isCoverOpen,
          })}
        >
          <CardMedia component={Loading} />
        </div>
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
        <div className={classes.details}>
          <FormControl
            variant="outlined"
            className={classes.select}
            error={empty}
          >
            {newTag.select ? (
              <TextField
                required
                label="New tag"
                variant="outlined"
                onChange={handleSelectTag}
                defaultValue={newTag.value}
              />
            ) : (
              <>
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
                  <MenuItem value={tag} onClick={handleSetNewTag}>
                    <strong>{newTag.value}</strong>
                    <em className={classes.none}>(New tag)</em>
                  </MenuItem>
                  {isTagReady ? (
                    allTags.map((t) => (
                      <MenuItem key={t.id} value={t.name}>
                        {t.name}
                      </MenuItem>
                    ))
                  ) : (
                    <Loading />
                  )}
                </Select>
                {empty ? (
                  <FormHelperText>A tag is necessary</FormHelperText>
                ) : null}
              </>
            )}
          </FormControl>
          <FormControl>
            {newTag.select ? (
              <Button
                variant="contained"
                color={tag === "" ? "default" : "primary"}
                className={`${classes.central} ${classes.rounded} ${classes.text}`}
                onClick={handleNewTagOK}
              >
                {tag === "" ? "Cancel" : "OK"}
              </Button>
            ) : isReady === "Loading" ? (
              <div className={classes.descLoad}>
                <Loading />
              </div>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                className={`${classes.central} ${classes.rounded} ${classes.text}`}
                onClick={handleUploadDesc}
              >
                Submit
              </Button>
            )}
          </FormControl>
          <MyQuill value={value} setValue={setValue} />
        </div>
      </Card>
    );
  }
  return (
    <Card className={`${classes.root} ${classes.fail}`}>
      <Errormsg />
    </Card>
  );
}
