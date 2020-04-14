import React, { useMemo } from "react";
import firebase from "firebase/app";

import Grid from "@material-ui/core/Grid";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListSubheader from "@material-ui/core/ListSubheader";

import DoneIcon from "@material-ui/icons/Done";

import { RoomState } from "../redux/types";
import type { RoomMember } from "../redux/types";

import RoomMemberList from "../RoomMemberList";
import VisibilitySettings from "../VisibilitySettings";

import useStyles from "./RoomLobby.styles";

interface RoomLobbyProps {
  roomState: RoomState;
  userId: string;
  members: Record<string, RoomMember>;
  userMember: RoomMember;
  userMemberRef: firebase.firestore.DocumentReference;
  readyCount: number;
}

function RoomLobby({
  roomState,
  userId,
  members,
  userMember,
  userMemberRef,
  readyCount,
}: RoomLobbyProps) {
  const classes = useStyles();

  const memberCount = useMemo(() => Object.keys(members).length, [members]);

  function handleVisibilitySave(roomMember: RoomMember) {
    const { avatarUrl = firebase.firestore.FieldValue.delete() } = roomMember;

    userMemberRef.update({
      ...roomMember,
      avatarUrl,
    });
  }

  function handleReadyClick(isReady: boolean) {
    userMemberRef.update({ isReady });
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <VisibilitySettings
          member={userMember}
          onSave={handleVisibilitySave}
          hideAction={roomState !== RoomState.LOBBY}
          onReadyClick={handleReadyClick}
        />
      </Grid>
      <Grid item xs={12}>
        <RoomMemberList
          userId={userId}
          members={members}
          aria-labelledby="member-list-subheader"
          subheader={
            <ListSubheader id="member-list-subheader">
              Members ({readyCount}/{memberCount})
            </ListSubheader>
          }
          getSecondaryAction={(member) =>
            member.isReady && (
              <ListItemSecondaryAction>
                <DoneIcon className={classes.readyIcon} />
              </ListItemSecondaryAction>
            )
          }
        />
      </Grid>
    </Grid>
  );
}

export type { RoomLobbyProps };
export default RoomLobby;
