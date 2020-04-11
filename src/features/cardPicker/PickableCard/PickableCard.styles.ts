import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    display: "flex",
    justifyContent: "center",
    height: 100,
  },
  value: {
    margin: "auto",
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
}));

export default useStyles;
