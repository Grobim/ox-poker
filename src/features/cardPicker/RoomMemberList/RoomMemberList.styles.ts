import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 0),
  },
  item: {
    padding: theme.spacing(1, 2),
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  name: {
    flex: 1,
  },
  value: {
    fontWeight: "bold",
    width: theme.spacing(3),
    textAlign: "center",
  },
  subheader: {
    lineHeight: "48px",
    padding: theme.spacing(0, 2),
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
}));

export default useStyles;
