import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 100,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    display: "flex",
    flex: 1,
    padding: theme.spacing(1, 2, 0),
  },
  input: {
    width: 52,
    fontSize: 28,
  },
  delete: {
    marginLeft: "auto",
  },
}));

export default useStyles;
