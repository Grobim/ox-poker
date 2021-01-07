import { makeStyles } from "@material-ui/core";

const avatarSize = 144;

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: avatarSize,
    width: avatarSize,
    margin: "0 auto",
  },
  avatarButton: {
    overflow: "hidden",
  },
  avatarInput: {
    opacity: 0,
    position: "absolute",
    top: 0,
    right: 0,
    margin: 0,
    fontSize: 200,
    cursor: "pointer",
    direction: "ltr",
  },
  fab: {
    position: "fixed",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

export default useStyles;
