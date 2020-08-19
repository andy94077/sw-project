import React, { useState } from "react";
import { makeStyles, useTheme, IconButton, Button } from "@material-ui/core";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CustomModal from "../components/CustomModal";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: "500px",
  },
  jumpFrame: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "25px",
    textAlign: "center",
    margin: "auto",
    maxHeight: "600px",
    overflow: "hidden",
    width: "84%",
    [`@media (min-width: 500px)`]: {
      width: "420px",
    },
  },
  bold: {
    color: "#111",
    fontWeight: "700",
  },
  Icon: {
    margin: "2px 0 0 5px",
    position: "absolute",
    height: "25px",
    width: "25px",
  },
  EditIcon: { height: "15px", width: "15px" },
  closeButton: {
    borderRadius: "0px",
    bottom: "0px",
    height: "48px",
    width: "100%",
  },
}));

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function FollowInformation(props) {
  const { follow } = props;
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = () => {
    setShow(true);
  };

  const handClose = () => {
    setShow(false);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <span className={classes.bold}>
          {follow.followers} followers · {follow.followings} followings
        </span>
        <IconButton
          component="span"
          className={classes.Icon}
          onClick={handleSearch}
        >
          <RemoveRedEyeIcon className={classes.EditIcon} />
        </IconButton>
      </div>
      <CustomModal
        show={show}
        onHide={handClose}
        jumpFrame={classes.jumpFrame}
        backdrop
      >
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab component="span" label="followers" />
              <Tab component="span" label="followings" />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0} dir={theme.direction}>
            Item One
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            Item Two
          </TabPanel>
        </div>
        <Button
          variant="contained"
          component="span"
          className={classes.closeButton}
          onClick={handClose}
        >
          Close
        </Button>
      </CustomModal>
    </>
  );
}
