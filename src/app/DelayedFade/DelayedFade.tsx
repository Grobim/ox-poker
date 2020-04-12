import React, { useEffect, useState } from "react";

import Fade, { FadeProps } from "@material-ui/core/Fade";
import { useTheme } from "@material-ui/core/styles";

function DelayedFade(props: FadeProps) {
  const theme = useTheme();

  const { in: open, timeout } = props;

  const [hasWaitedEnter, setHasWaitedEnter] = useState(false);
  const [hasWaitedExit, setHasWaitedExit] = useState(false);

  const transitionDurations = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const exitDuration =
    typeof timeout === "number" ? timeout : transitionDurations.exit;

  useEffect(() => {
    let timeoutRef: NodeJS.Timeout;

    if (open) {
      timeoutRef = setTimeout(() => {
        setHasWaitedEnter(true);
      }, exitDuration);
    } else {
      setHasWaitedEnter(false);
    }

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, [open, exitDuration]);

  useEffect(() => {
    let timeoutRef: NodeJS.Timeout;

    if (hasWaitedEnter && !open) {
      timeoutRef = setTimeout(() => {
        setHasWaitedExit(true);
      }, exitDuration);
    } else {
      setHasWaitedExit(false);
    }

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, [hasWaitedEnter, open, exitDuration]);

  if ((open && !hasWaitedEnter) || (!open && !hasWaitedExit)) {
    return null;
  }

  return (
    <Fade
      {...props}
      timeout={timeout || { ...transitionDurations }}
      in={open && hasWaitedEnter}
    />
  );
}

export default DelayedFade;
