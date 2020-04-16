import { makeStyles } from "@material-ui/core/styles";

const useStyles = (fontSize?: string | number) =>
  makeStyles((theme) => {
    const revealFontSize = fontSize || theme.typography.h4.fontSize;

    return {
      root: {
        minHeight: "100%",
      },
      content: {
        display: "flex",
        justifyContent: "center",
      },
      value: {
        margin: "auto",
      },
      icon: {
        height: revealFontSize,
        width: revealFontSize,
      },
      label: {
        fontSize,
        fontWeight: "bold",
      },
    };
  })();

export default useStyles;
