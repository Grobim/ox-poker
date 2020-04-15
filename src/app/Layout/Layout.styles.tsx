import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  root: {
    display: "flex",
    height: "100%",
  },
  toolbar: {
    minHeight: 64,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  main: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: theme.spacing(2),
  },
  navItem: {
    textTransform: "initial",
  },
  activeLink: {
    backgroundColor: theme.palette.action.selected,
  },
}));

export default useStyles;
