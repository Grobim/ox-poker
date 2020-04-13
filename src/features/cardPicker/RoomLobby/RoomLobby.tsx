import React, { useMemo } from "react";
import { isEmpty, useFirestore } from "react-redux-firebase";
import firebase from "firebase/app";
import map from "lodash/map";
import filter from "lodash/filter";

import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import DoneIcon from "@material-ui/icons/Done";

import type { RoomMember } from "../redux/types";

import VisibilitySettings from "../VisibilitySettings";

import useStyles from "./RoomLobby.styles";

interface RoomLobbyProps {
  roomId: string;
  userId: string;
  members: Record<string, RoomMember>;
}

function RoomLobby({ roomId, members, userId }: RoomLobbyProps) {
  const firestore = useFirestore();

  const classes = useStyles();

  const readyMemberCount = useMemo(
    () => filter(members || {}, (member) => member.isReady).length,
    [members]
  );
  const memberCount = useMemo(() => Object.keys(members || {}).length, [
    members,
  ]);

  const userMemberRef = firestore.doc(`rooms/${roomId}/members/${userId}`);

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
      {!isEmpty(members[userId]) && (
        <Grid item xs={12}>
          <VisibilitySettings
            member={members[userId]}
            onSave={handleVisibilitySave}
            onReadyClick={handleReadyClick}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <List
          aria-labelledby="member-list-subheader"
          subheader={
            <ListSubheader id="member-list-subheader">
              Members ({readyMemberCount}/{memberCount})
            </ListSubheader>
          }
        >
          {map(
            members,
            ({ displayName, avatarUrl, isReady }, memberId: string) => (
              <ListItem key={memberId} selected={userId === memberId}>
                <ListItemAvatar>
                  <Avatar alt={displayName} src={avatarUrl} />
                </ListItemAvatar>
                <ListItemText primary={displayName || "Anonymous"} />
                {isReady && (
                  <ListItemSecondaryAction>
                    <DoneIcon className={classes.readyIcon} />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            )
          )}
        </List>
      </Grid>
    </Grid>
  );
}

export type { RoomLobbyProps };
export default RoomLobby;
