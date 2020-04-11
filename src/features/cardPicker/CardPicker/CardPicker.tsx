import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import storeManager from "../../../app/redux/StoreManager";

import { name, reducer } from "../redux/slice";
import { useCards, useSelectedCard } from "../hooks";

import PickableCard from "../PickableCard";

storeManager.registerReducers({
  [name]: reducer,
});

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept("../redux/slice", () => {
      storeManager.registerReducers({
        [name]: reducer,
      });
      storeManager.refreshStore();
    });
  }
}

function CardPicker() {
  const cards = useCards();
  const selectedCard = useSelectedCard();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        CardPicker
      </Typography>
      <Grid container spacing={1}>
        {cards.map((card) => (
          <Grid item key={card} xs={4} sm={3} md={2}>
            <PickableCard card={card} selected={selectedCard === card} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default CardPicker;
