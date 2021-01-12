import { useDispatch } from "react-redux";
import clsx from "clsx";

import Grid from "@material-ui/core/Grid";

import { useCards, useSelectedCard } from "../hooks";
import { setSelectedCard } from "../redux";
import type { SpecialCard } from "../redux/types";

import ClickableCard from "../ClickableCard";

import useStyles from "./CardSelector.styles";

function CardSelector() {
  const dispatch = useDispatch();

  const cards = useCards();
  const selectedCard = useSelectedCard();

  const classes = useStyles();

  function handleCardSelect(card?: number | SpecialCard) {
    dispatch(setSelectedCard(card));
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
