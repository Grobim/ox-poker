import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    flex: 1,
    height: 48,
  },
  editIconEditing: {
    color: theme.palette.secondary.main,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default useStyles;
