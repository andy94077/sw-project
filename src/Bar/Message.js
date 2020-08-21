import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import CustomModal from "../components/CustomModal";
import { CONCAT_SERVER_URL } from "../utils";

const useStyles = makeStyles((theme) => ({
  rounded: {
    width: "32px",
    borderRadius: "16px",
    marginRight: "10px",
  },
  accordion: {
    margin: 0,
    borderBottom: "1px solid #aaa",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "44.44%",
    flexShrink: 0,
    fontWeight: 800,
    overflow: "hidden",
  },
  secondaryHeading: {
    paddingLeft: "50px",
    margin: "auto",
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
    overflow: "hidden",
  },
  jumpFrame: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    height: "100%",
    maxWidth: "800px",
    [`@media (max-width: 800px)`]: {
      maxWidth: "600px",
    },
  },
  none: {
    pointerEvents: "none",
  },
}));

export default function Message(props) {
  const classes = useStyles();
  const { type, text, time } = props;

  const [show, setShow] = useState(false);

  // Toggle function (for chat)
  const handleSetShow = () => {
    if (type === "chat") {
      setShow(true);
    }
  };

  const onHide = () => {
    setShow(false);
  };

  return (
    <div>
      {text.map((page) =>
        page.message.map((value) => {
          const background =
            time === null || time < value.created_at ? "#fff8e5" : "white";

          return (
            <div
              key={time + value.id}
              onClick={handleSetShow}
              onKeyDown={handleSetShow}
              tabIndex={0}
              role="button"
              style={{ outline: "none" }}
            >
              <Accordion
                defaultExpanded={background === "#fff8e5" || type === "chat"}
                className={clsx(classes.accordion, {
                  [classes.none]: type === "chat",
                })}
                style={{
                  borderRadius: 0,
                  background,
                }}
              >
                <AccordionSummary
                  expandIcon={type !== "chat" && <ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    {type === "chat" && (
                      <>
                        <img
                          alt="Avatar"
                          className={classes.rounded}
                          src={CONCAT_SERVER_URL(value.header.avatar_url)}
                        />
                        {value.header.username}
                      </>
                    )}
                    {type !== "chat" && value.header}
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    {value.secondary}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div dangerouslySetInnerHTML={{ __html: value.content }} />
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })
      )}
      {type === "chat" && (
        <CustomModal
          show={show}
          onHide={onHide}
          jumpFrame={classes.jumpFrame}
          backdrop
        >
          <h4>Chatroom</h4>
        </CustomModal>
      )}
    </div>
  );
}
