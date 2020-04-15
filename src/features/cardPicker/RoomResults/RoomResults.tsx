import React from "react";

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";

import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import LockIcon from "@material-ui/icons/Lock";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import { RoomMember, SpecialCard } from "../redux/types";

import RoomMemberList from "../RoomMemberList";

import useStyles from "./RoomResults.styles";

interface RoomResultsProps {
  userId: string;
  members: Record<string, RoomMember>;
  hideResults?: boolean;
}

function RoomResults({
  userId,
  members,
  hideResults = false,
}: RoomResultsProps) {
  const classes = useStyles();

  return (
    <RoomMemberList
      members={members}
      getSecondaryAction={(member, memberId) => {
        let actionIcon = null;

        if (!member.isReady) {
          actionIcon = <LockIcon />;
        } else if (typeof member.selectedCard !== "undefined") {
          if (userId === memberId || !hideResults) {
            if (member.selectedCard === SpecialCard.LONG) {
              actionIcon = <HourglassFullIcon />;
            } else if (member.selectedCard === SpecialCard.PAUSE) {
              actionIcon = <LocalCafeIcon />;
            } else {
              actionIcon = (
                <Typography className={classes.visibleValue}>
                  {member.selectedCard}
                </Typography>
              );
            }
          } else {
            actionIcon = <VisibilityOffIcon />;
          }
        }

        if (actionIcon) {
          return (
            <ListItemSecondaryAction>{actionIcon}</ListItemSecondaryAction>
          );
        }
      }}
    />
  );
}

export type { RoomResults };
export default RoomResults;
