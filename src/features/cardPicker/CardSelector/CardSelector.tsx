import React from "react";
import clsx from "clsx";

import Grid from "@material-ui/core/Grid";

import { useSelectedCard } from "../hooks";
import type { SpecialCard } from "../redux/types";

import ClickableCard from "../ClickableCard";

import useStyles from "./CardSelector.styles";

interface CardSelectorProps {
  cards: (number | SpecialCard)[];
  onSelect: (selected: number | SpecialCard) => void;
}

function CardSelector({ cards, onSelect }: CardSelectorProps) {
  const classes = useStyles();

  const selectedCard = useSelectedCard();

  function handleCardSelect(card: number | SpecialCard) {
    onSelect(card);
  }

  return (
    <Grid container spacing={1}>
      {cards.map((card) => (
        <Grid item key={card} xs={4} sm={3} md={2}>
          <ClickableCard
            card={card}
            className={clsx({ [classes.selected]: selectedCard === card })}
            onSelect={handleCardSelect}
            contentClassName={classes.cardHeight}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default CardSelector;
