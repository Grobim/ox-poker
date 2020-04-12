import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
  cardHeight: {
    height: 100,
  },
}));

export default useStyles;
