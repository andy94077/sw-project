import React, { useRef } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CardMedia, Card } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

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
    [theme.breakpoints.down("xs")]: {
      height: "57%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "53%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      heught: "100%",
    },
  },
  cover: {
    [theme.breakpoints.down("xs")]: {
      height: "43%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "47%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      height: "100%",
    },
  },
  textarea: {
    marginRight: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    height: "400px",
    overflow: "auto",
  },
  textfield: {
    marginTop: "20px",
    marginLeft: "20px",
  },
  central: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
  },
  rounded: {
    marginTop: "20px",
    width: "calc(100% - 10px)",
    borderRadius: "60px",
  },
  text: {
    lineHeight: "25px",
    fontSize: "16px",
  },
}));

export default function ContentCard(props) {
  const { userId, username, src } = props;
  const classes = useStyles();
  const desc = useRef();
  const history = useHistory();

  const handleUploadDesc = () => {
    const jsonData = {
      url: src,
      user_id: userId,
      username,
      content: desc.current.value,
      tag: "cat",
    };

    axios
      .request({
        method: "POST",
        url: "http://pinterest-server.test/api/v1/profile/uploadDesc",
        data: jsonData,
      })
      .then((res) => {
        console.log(res.data.url);
        history.push("/picture/1");
      });
  };

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={src}
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <TextField
          id="outlined-start-adornment"
          className={classes.textfield}
          label="Image description"
          multiline
          rowsMax="17"
          variant="outlined"
          InputProps={{
            className: classes.textarea,
            startAdornment: (
              <InputAdornment>
                <Button
                  variant="contained"
                  color="secondary"
                  className={`${classes.central} ${classes.rounded} ${classes.text}`}
                  onClick={handleUploadDesc}
                >
                  Submit
                </Button>
              </InputAdornment>
            ),
          }}
          inputRef={desc}
        />
      </div>
    </Card>
  );
}
