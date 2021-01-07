import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
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
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default useStyles;
