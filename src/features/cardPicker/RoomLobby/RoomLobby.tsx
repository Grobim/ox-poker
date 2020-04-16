import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import firebase from "firebase/app";

import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import DoneIcon from "@material-ui/icons/Done";

import { useUserId } from "../../auth";

import type { Room, RoomMember } from "../redux/types";

import RoomMemberList, { RoomMemberValueProps } from "../RoomMemberList";
import RoomSettings from "../RoomSettings";
import VisibilitySettings from "../VisibilitySettings";

import useStyles from "./RoomLobby.styles";

function RoomCheck({ member: { isReady } }: RoomMemberValueProps) {
  const classes = useStyles();

  if (isReady) {
    return (
      <Grid item>
        <DoneIcon className={classes.readyIcon} />
      </Grid>
    );
  }

  return null;
}

interface RoomLobbyProps {
  room: Room;
  roomRef: firebase.firestore.DocumentReference;
  members: Record<string, RoomMember>;
  userMember: RoomMember;
  userMemberRef: firebase.firestore.DocumentReference;
  readyCount: number;
}

interface RoomLobbyRouteState {
  newRoom?: boolean;
}

function RoomLobby({
  room,
  roomRef,
  members,
  userMember,
  userMemberRef,
  readyCount,
}: RoomLobbyProps) {
  const { newRoom = false } = useLocation<RoomLobbyRouteState>().state || {};

  const userId = useUserId();

  const memberCount = useMemo(() => Object.keys(members).length, [members]);

  const [expandRoomSettings, setExpandRoomSettings] = useState(newRoom);

  function handleRoomSave(room: Partial<Room>) {
    const { displayName = firebase.firestore.FieldValue.delete() } = room;

    roomRef.update({
      ...room,
      displayName,
    });
  }

  function handleRoomSettingsClose() {
    setExpandRoomSettings(!expandRoomSettings);
  }

  function handleVisibilitySave(roomMember: Partial<RoomMember>) {
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
        <Card>
          {room.owner === userId && (
            <>
              <RoomSettings
                room={room}
                expanded={expandRoomSettings}
                onSave={handleRoomSave}
                onCloseClick={handleRoomSettingsClose}
              />
              <Divider />
            </>
          )}
          <VisibilitySettings
            member={userMember}
            expanded={!expandRoomSettings && !userMember.isReady}
            onSave={handleVisibilitySave}
            onReadyClick={handleReadyClick}
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <RoomMemberList
          members={members}
          subheader={`Members (${readyCount}/${memberCount})`}
          ValueComponent={RoomCheck}
        />
      </Grid>
    </Grid>
  );
}

export type { RoomLobbyProps, RoomLobbyRouteState };
export default RoomLobby;
