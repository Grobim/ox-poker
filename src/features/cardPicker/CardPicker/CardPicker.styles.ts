import { makeStyles } from "@material-ui/core";

const revealFontSize = "22vh";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  hiddenLabelContainer: {
    height: "100%",
    display: "flex",
  },
  hiddenLabel: {
    margin: "auto",
  },
  content: {
    flex: 1,
  },
  revealCard: {
    height: "100%",
  },
  revealContent: {
    textAlign: "center",
  },
  revealLabel: {
    fontSize: revealFontSize,
    fontWeight: "bold",
  },
  revealIcon: {
    height: revealFontSize,
    width: revealFontSize,
  },
}));

export default useStyles;
