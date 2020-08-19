import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "275px",
    maxWidth: "600px",
    zIndex: "2000",
    [theme.breakpoints.up("md")]: {
      minWidth: "400px",
    },
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
  const { text, type, time } = props;

  return (
    <div className={classes.root}>
      {text.map((value) => {
        const background =
          time === null || time < value.created_at ? "#fff8e5" : "white";

        return (
          <Accordion
            key={time + value.id}
            defaultExpanded={background === "#fff8e5"}
            style={{
              margin: 0,
              borderBottom: "1px solid #aaa",
              background,
            }}
          >
            <AccordionSummary
              expandIcon={type === "notes" && <ExpandMoreIcon />}
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
              {type === "chat" && <ExpandMoreIcon />}
              {type === "notes" && (
                <div dangerouslySetInnerHTML={{ __html: value.content }} />
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
