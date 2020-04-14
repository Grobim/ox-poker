import React, { useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";

import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";

import EditIcon from "@material-ui/icons/Edit";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import storeManager from "../../../app/redux/StoreManager";

import { useCards, useSelectedCard } from "../hooks";
import { setCards, setSelectedCard } from "../redux";
import { name, reducer } from "../redux/slice";
import { SpecialCard } from "../redux/types";

import DelayedFade from "../../../app/DelayedFade";

import CardEditor from "../CardEditor";
import CardSelector from "../CardSelector";
import CardHider from "../CardHider";
import ClickableCard from "../ClickableCard";

import useStyles from "./CardPicker.styles";

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

enum PickState {
  PICKING,
  HIDDEN,
  REVEALED,
}

function CardPicker() {
  const dispatch = useDispatch();

  const classes = useStyles();

  const cards = useCards();
  const selectedCard = useSelectedCard();
  const [editableCards, setEditableCards] = useState(
    cards.filter((card) => typeof card === "number") as number[]
  );

  const [pickState, setPickState] = useState(PickState.PICKING);
  const [isEditing, setIsEditing] = useState(false);

  function handleCardHiderClick() {
    setPickState(PickState.REVEALED);
  }

  function handleHideClick() {
    setPickState(PickState.HIDDEN);
  }

  function handleRevealCardClick() {
    setPickState(PickState.PICKING);
    dispatch(setSelectedCard());
  }

  function handleEditClick() {
    setIsEditing(!isEditing);
    dispatch(setSelectedCard());

    if (isEditing) {
      dispatch(setCards(editableCards));
    }
  }

  function handleEditableCardsChange(newCards: number[]) {
    setEditableCards(newCards);
  }

  return (
    <Grid container className={classes.root} direction="column" spacing={2}>
      <Grid item className={classes.titleContainer}>
        <Typography variant="h4" className={classes.title}>
          CardPicker
        </Typography>
        {pickState === PickState.PICKING && (
          <IconButton
            className={clsx({
              [classes.editIconEditing]: isEditing,
            })}
            onClick={handleEditClick}
          >
            <EditIcon />
          </IconButton>
        )}
      </Grid>
      <Grid item className={classes.content}>
        <DelayedFade in={pickState === PickState.PICKING}>
          {isEditing ? (
            <CardEditor
              cards={editableCards}
              onCardsChange={handleEditableCardsChange}
            />
          ) : (
            <CardSelector />
          )}
        </DelayedFade>
        <DelayedFade in={pickState === PickState.HIDDEN}>
          <CardHider onClick={handleCardHiderClick} />
        </DelayedFade>
        <DelayedFade in={pickState === PickState.REVEALED}>
          <ClickableCard
            card={selectedCard as number | SpecialCard}
            onSelect={handleRevealCardClick}
            fontSize="22vh"
          />
        </DelayedFade>
        <Zoom
          in={
            Boolean(selectedCard) &&
            pickState === PickState.PICKING &&
            !isEditing
          }
        >
          <Fab
            color="primary"
            className={classes.fab}
            onClick={handleHideClick}
          >
            <VisibilityOffIcon />
          </Fab>
        </Zoom>
      </Grid>
    </Grid>
  );
}

export default CardPicker;
