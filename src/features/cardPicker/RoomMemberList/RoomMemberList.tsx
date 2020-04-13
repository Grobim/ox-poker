import React from "react";
import map from "lodash/map";

import Avatar from "@material-ui/core/Avatar";
import List, { ListProps } from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

import type { RoomMember } from "../redux/types";

interface RoomMemberListProps extends ListProps {
  userId?: string;
  members: Record<string, RoomMember>;
  getSecondaryAction?: (member: RoomMember, memberId: string) => unknown;
}

function RoomMemberList({
  members,
  userId,
  getSecondaryAction,
  ...props
}: RoomMemberListProps) {
  return (
    <List {...props}>
      {map(members, (member, memberId: string) => (
        <ListItem key={memberId} selected={userId === memberId}>
          <ListItemAvatar>
            <Avatar alt={member.displayName} src={member.avatarUrl} />
          </ListItemAvatar>
          <ListItemText primary={member.displayName || "Anonymous"} />
          {getSecondaryAction && getSecondaryAction(member, memberId)}
        </ListItem>
      ))}
    </List>
  );
}

export type { RoomMemberListProps };
export default RoomMemberList;
