import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import LockIcon from "@material-ui/icons/Lock";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import { RoomMember, SpecialCard } from "../redux/types";

import useStyles from "./RoomMemberList.styles";

interface RoomMemberValueProps {
  member: RoomMember;
  hideValue?: boolean;
}

function RoomMemberValue({
  member: { isReady, selectedCard },
  hideValue,
}: RoomMemberValueProps) {
  const classes = useStyles();

  let value = null;

  if (!isReady) {
    value = <LockIcon />;
  } else if (typeof selectedCard !== "undefined") {
    if (!hideValue) {
      if (selectedCard === SpecialCard.LONG) {
        value = <HourglassFullIcon />;
      } else if (selectedCard === SpecialCard.PAUSE) {
        value = <LocalCafeIcon />;
      } else {
        value = (
          <Typography className={classes.value}>{selectedCard}</Typography>
        );
      }
    } else {
      value = <VisibilityOffIcon />;
    }
  }

  if (!value) {
    return null;
  }

  return <Grid item>{value}</Grid>;
}

export type { RoomMemberValueProps };
export default RoomMemberValue;
