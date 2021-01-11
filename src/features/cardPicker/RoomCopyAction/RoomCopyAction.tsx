import React from "react";
import { useParams } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";

import type { RoomRouteParams } from "../Room";

import { ContentCopy } from "../../../assets/icons";

import useStyles from "./RoomCopyAction.styles";

function RoomCopyAction() {
  const { roomId } = useParams<RoomRouteParams>();

  const classes = useStyles();

  function handleCopyClick() {
    const inputField = document.createElement("textarea");
    document.body.appendChild(inputField);
    inputField.value = roomId;
    inputField.select();
    document.execCommand("copy");
    document.body.removeChild(inputField);
    console.log("Copied", roomId);
  }

  return (
    <IconButton onClick={handleCopyClick} className={classes.copyIcon}>
      <ContentCopy />
    </IconButton>
  );
}

export default RoomCopyAction;
