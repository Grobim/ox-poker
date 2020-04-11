import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import { useTheme } from "@material-ui/core/styles";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import storeManager from "../../../app/redux/StoreManager";

import { useCards, useSelectedCard } from "../hooks";
import { resetSelectedCard } from "../redux";
import { name, reducer } from "../redux/slice";
import { SpecialCard } from "../redux/types";

import PickableCard from "../PickableCard";

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
  const theme = useTheme();

  const cards = useCards();
  const selectedCard = useSelectedCard();

  const [pickState, setPickState] = useState(PickState.PICKING);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const clickEventListener = useCallback(
    function clickEventListener(event: MouseEvent) {
      if (pickState === PickState.HIDDEN) {
        event.preventDefault();
        event.stopPropagation();
        setPickState(PickState.REVEALED);
      }
    },
    [pickState]
  );

  useEffect(() => {
    document.body.addEventListener("click", clickEventListener);

    return () => {
      document.body.removeEventListener("click", clickEventListener);
    };
  }, [clickEventListener]);

  function handleHideClick() {
    setPickState(PickState.HIDDEN);
  }

  function handleRevealCardClick() {
    setPickState(PickState.PICKING);
    dispatch(resetSelectedCard());
  }

  return (
    <Grid container className={classes.root} direction="column">
      <Grid item>
        <Typography variant="h4" gutterBottom>
          CardPicker
        </Typography>
      </Grid>
      <Grid item className={classes.content}>
        <Fade
          in={pickState === PickState.PICKING}
          unmountOnExit
          timeout={transitionDuration}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
        >
          <Grid container spacing={1}>
            {cards.map((card) => (
              <Grid item key={card} xs={4} sm={3} md={2}>
                <PickableCard card={card} selected={selectedCard === card} />
              </Grid>
            ))}
          </Grid>
        </Fade>
        <Fade
          in={pickState === PickState.HIDDEN}
          unmountOnExit
          timeout={transitionDuration}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
        >
          <div className={classes.hiddenLabelContainer}>
            <Typography variant="h5" className={classes.hiddenLabel}>
              Click anywhere to reveal
            </Typography>
          </div>
        </Fade>
        <Fade
          in={pickState === PickState.REVEALED}
          unmountOnExit
          timeout={{
            enter: transitionDuration.enter,
          }}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
        >
          {pickState === PickState.REVEALED ? (
            <Card className={classes.revealCard}>
              <CardActionArea
                className={classes.revealCard}
                onClick={handleRevealCardClick}
              >
                <CardContent className={classes.revealContent}>
                  {selectedCard === SpecialCard.LONG ? (
                    <HourglassFullIcon className={classes.revealIcon} />
                  ) : selectedCard === SpecialCard.PAUSE ? (
                    <LocalCafeIcon className={classes.revealIcon} />
                  ) : (
                    <Typography className={classes.revealLabel}>
                      {selectedCard}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ) : (
            <div />
          )}
        </Fade>
        <Zoom in={Boolean(selectedCard) && pickState === PickState.PICKING}>
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
