import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
  cardHeight: {
    height: 100,
  },
}));

export default useStyles;
