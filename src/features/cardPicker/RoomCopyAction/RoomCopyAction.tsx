import React, { SyntheticEvent, useState } from "react";
import { useParams } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

import type { RoomRouteParams } from "../Room";

import { ContentCopy } from "../../../assets/icons";
import { copyToClipboard } from "../../../utils";

import useStyles from "./RoomCopyAction.styles";

function RoomCopyAction() {
  const { roomId } = useParams<RoomRouteParams>();
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  function handleCopyClick() {
    copyToClipboard(roomId);
    setOpen(true);
  }

  const handleClose = (_: SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleCopyClick} className={classes.copyIcon}>
        <ContentCopy />
      </IconButton>
      <Snackbar
        message="Room ID copied to clipboard"
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default RoomCopyAction;
