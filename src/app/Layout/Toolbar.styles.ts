import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  avatarContainer: {
    padding: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

export default useStyles;
