import React from "react";

import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";

import useStyles from "./Loader.styles";
import clsx from "clsx";

interface LoaderProps {
  className?: string;
  fill?: boolean;
  circularProgressProps?: CircularProgressProps;
}

function Loader({
  className,
  fill = false,
  circularProgressProps,
}: LoaderProps) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className, {
        [classes.fillParent]: fill,
      })}
    >
      <CircularProgress {...circularProgressProps} />
    </div>
  );
}

export default Loader;
