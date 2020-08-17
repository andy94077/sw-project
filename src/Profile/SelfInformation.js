import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { makeStyles, IconButton, Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { selectUser } from "../redux/userSlice";
import AlertDialog from "../components/AlertDialog";
import MyQuill from "../components/MyQuill";
import { CONCAT_SERVER_URL } from "../utils";

const usestyle = makeStyles(() => ({
  outFrame: {
    display: "inline-block",
    maxHeight: "200px",
    maxWidth: "60%",
    margin: "auto",
    padding: "10px",
    fontSize: "30px",
    overflow: "auto",
  },
  autoBreakLine: {
    wordWrap: "break-word",
  },
  Icon: {
    margin: "auto",
    height: "25px",
    width: "25px",
  },
  EditIcon: { height: "15px", width: "15px" },
}));

export default function SelfInformation() {
  const classes = usestyle();
  // Get intro from database
  const { userId } = useSelector(selectUser);
  const [intro, setIntro] = useState("Hi");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    axios
      .get(CONCAT_SERVER_URL("/api/v1/users/intro"), {
        params: { user_id: userId },
      })
      .then((response) => {
        setIntro(response.data.intro);
      });
  }, []);

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEdit = () => {
    axios
      .request({
        method: "POST",
        url: CONCAT_SERVER_URL("/api/v1/users/intro"),
        data: { user_id: userId, intro },
      })
      .then((response) => {
        setIntro(response.data.intro);
      })
      .catch()
      .finally(() => {
        handleEditDialogClose();
      });
  };

  return (
    <>
      <div>
        <div className={classes.outFrame}>
          <span className={classes.autoBreakLine}>
            <div dangerouslySetInnerHTML={{ __html: intro }} />
          </span>
        </div>
        <IconButton
          component="span"
          className={classes.Icon}
          onClick={handleEditDialogOpen}
        >
          <EditIcon className={classes.EditIcon} />
        </IconButton>
      </div>
      <AlertDialog
        open={isEditDialogOpen}
        alertTitle="Edit Information"
        alertButton={
          <div style={{ marginRight: "15px" }}>
            <Button onClick={handleEdit}>OK</Button>
            <Button onClick={handleEditDialogClose}>Cancel</Button>
          </div>
        }
        onClose={handleEditDialogClose}
        moreComponent={<MyQuill value={intro} setValue={setIntro} />}
      />
    </>
  );
}
