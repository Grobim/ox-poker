import React, { useCallback, useEffect } from "react";

import Typography from "@material-ui/core/Typography";

import useStyles from "./CardHider.styles";

interface CardHiderProps {
  onClick: () => void;
}

function CardHider({ onClick }: CardHiderProps) {
  const classes = useStyles();

  const clickEventListener = useCallback(
    function clickEventListener(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    },
    [onClick]
  );

  useEffect(() => {
    document.body.addEventListener("click", clickEventListener);

    return () => {
      document.body.removeEventListener("click", clickEventListener);
    };
  }, [clickEventListener]);

  return (
    <div className={classes.hiddenLabelContainer}>
      <Typography variant="h5" className={classes.hiddenLabel}>
        Tap anywhere to reveal
      </Typography>
    </div>
  );
}

export type { CardHiderProps };
export default CardHider;
