import React from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";

import { selectCard } from "../redux";
import { SpecialCard } from "../redux/types";

import useStyles from "./PickableCard.styles";

interface PickableCardProps {
  card: number | SpecialCard;
  selected?: boolean;
}

function PickableCard({ card, selected = false }: PickableCardProps) {
  const dispatch = useDispatch();

  const classes = useStyles();

  function handleCardClick() {
    dispatch(selectCard(card));
  }

  return (
    <Card className={clsx({ [classes.selected]: selected })}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent className={classes.content}>
          <div className={classes.value}>
            {card === SpecialCard.LONG ? (
              <HourglassFullIcon />
            ) : card === SpecialCard.PAUSE ? (
              <LocalCafeIcon />
            ) : (
              <Typography variant="h4">{card}</Typography>
            )}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export type { PickableCardProps };
export default PickableCard;
