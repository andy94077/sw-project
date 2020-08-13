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
    minWidth: "400px",
    maxWidth: "600px",
    zIndex: "2000",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    fontWeight: 800,
    overflow: "hidden",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
    overflow: "hidden",
  },
}));

export default function Content(props) {
  const classes = useStyles();

  const { text, defaultExpanded = false } = props;

  return (
    <div className={classes.root}>
      {text.map((value) => {
        return (
          <Accordion
            key={value.id}
            defaultExpanded={defaultExpanded}
            style={{ margin: 0, borderBottom: "1px solid #aaa" }}
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
                from {value.secondary}
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
