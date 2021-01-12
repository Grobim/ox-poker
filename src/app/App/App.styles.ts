import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  snackbar: {
    [theme.breakpoints.down("xs")]: {
      bottom: 90,
    },
  },
}));

export default useStyles;
