import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { selectUser } from "../redux/userSlice";
import { getCookie } from "../cookieHelper";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "350px",
    maxWidth: "600px",
    zIndex: "2000",
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
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
    overflow: "hidden",
  },
}));

export default function Content(props) {
  const classes = useStyles();
  const { text, defaultExpanded = false } = props;
  const { userId } = useSelector(selectUser);
  const notesCheck = getCookie(`notesCheck${userId}`);

  return (
    <div className={classes.root}>
      {text.map((value) => {
        const background =
          notesCheck === null || notesCheck < value.created_at
            ? "#fff8e5"
            : "white";

        return (
          <Accordion
            key={value.id}
            defaultExpanded={defaultExpanded || background === "#fff8e5"}
            style={{
              margin: 0,
              borderBottom: "1px solid #aaa",
              background,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                {value.header}
              </Typography>
              <Typography className={classes.secondaryHeading}>
                {value.secondary}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div dangerouslySetInnerHTML={{ __html: value.content }} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
