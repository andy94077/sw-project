import React from "react";
import { makeStyles, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const usestyle = makeStyles(() => ({
  outFrame: {
    display: "block",
    maxHeight: "200px",
    maxWidth: "60%",
    margin: "auto",
    fontSize: "30px",
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
  const intro = "Hi";
  return (
    <>
      <div style={{ height: "10px" }} />
      <div className={classes.outFrame}>
        <span className={classes.autoBreakLine}>{intro}</span>
        <IconButton component="span" className={classes.Icon}>
          <EditIcon className={classes.EditIcon} />
        </IconButton>
      </div>
      <div style={{ height: "10px" }} />
      {/* <AlertDialog
        open={isEditDialogOpen}
        alertTitle="Edit Post"
        alertButton={
          <>
            <Button onClick={handleEdit}>Yes</Button>
            <Button onClick={handleEditDialogClose}>No</Button>
          </>
        }
        onClose={handleEditDialogClose}
        moreComponent={
          <MyQuill
            className={classes.myQuill}
            value={newPost}
            setValue={setNewPost}
          />
        }
      /> */}
    </>
  );
}
