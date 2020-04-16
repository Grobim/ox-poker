import React from "react";
import clsx from "clsx";
import map from "lodash/map";

import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { useUserId } from "../../auth";

import { RoomMember } from "../redux/types";

import RoomMemberValue, { RoomMemberValueProps } from "./RoomMemberValue";

import useStyles from "./RoomMemberList.styles";

interface RoomMemberListProps {
  members: Record<string, RoomMember>;
  hideValue?: boolean;
  ValueComponent?: (props: RoomMemberValueProps) => JSX.Element | null;
  subheader?: string;
}

function RoomMemberList({
  members,
  subheader,
  hideValue = false,
  ValueComponent = RoomMemberValue,
}: RoomMemberListProps) {
  const classes = useStyles();

  const userId = useUserId();

  return (
    <Grid className={classes.root} container direction="column">
      {subheader && (
        <Grid item className={classes.subheader}>
          {subheader}
        </Grid>
      )}
      {map(members, (member, memberId: string) => (
        <Grid
          key={memberId}
          item
          xs={12}
          container
          alignItems="center"
          className={clsx(classes.item, {
            [classes.selected]: userId === memberId,
          })}
        >
          <Grid item>
            <Avatar
              className={classes.avatar}
              alt={member.displayName}
              src={member.avatarUrl}
            />
          </Grid>
          <Grid item className={classes.name}>
            <Typography>{member.displayName || "Anonymous"}</Typography>
          </Grid>
          <ValueComponent
            member={member}
            hideValue={hideValue && memberId !== userId}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export type { RoomMemberListProps, RoomMemberValueProps };
export default RoomMemberList;
