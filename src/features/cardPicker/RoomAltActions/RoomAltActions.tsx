import { isEmpty, isLoaded, useFirestore } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import firebaseApp from "firebase/app";
import { useSnackbar } from "notistack";

import IconButton from "@material-ui/core/IconButton";

import EditIcon from "@material-ui/icons/Edit";

import DelayedFade from "../../../app/DelayedFade";
import { ContentCopy } from "../../../assets/icons";
import { copyToClipboard } from "../../../utils";
import { useUserId } from "../../auth";

import { useRoom, useUserRoomMember } from "../hooks";
import { RoomState } from "../redux/types";

import type { RoomRouteParams } from "../Room";

import useStyles from "./RoomAltAction.styles";

function RoomAltActions() {
  const firestore = useFirestore();
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const { roomId } = useParams<RoomRouteParams>();
  const userId = useUserId();

  const room = useRoom(roomId);
  const userMember = useUserRoomMember();

  function handleEditClick() {
    firestore.doc(`/rooms/${roomId}/members/${userId}`).update({
      selectedCard: firebaseApp.firestore.FieldValue.delete(),
    });
  }

  function handleCopyRoomIdClick() {
    copyToClipboard(roomId);
    enqueueSnackbar("Room ID copied to clipboard");
  }

  if (
    !isLoaded(room) ||
    isEmpty(room) ||
    !isLoaded(userMember) ||
    isEmpty(userMember)
  ) {
    return null;
  }

  return (
    <div className={classes.roomIcon}>
      <DelayedFade
        in={
          room.state === RoomState.PICKING &&
          typeof userMember.selectedCard !== "undefined"
        }
      >
        <IconButton onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
      </DelayedFade>
      <DelayedFade in={true}>
        <IconButton onClick={handleCopyRoomIdClick}>
          <ContentCopy />
        </IconButton>
      </DelayedFade>
    </div>
  );
}

export default RoomAltActions;
