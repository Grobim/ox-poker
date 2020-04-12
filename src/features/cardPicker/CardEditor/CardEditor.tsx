import React, { useState } from "react";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

import EditableCard from "../EditableCard";

import useStyles from "./CardEditor.styles";

interface CardEditorProps {
  cards: number[];
  onCardsChange: (cards: number[]) => void;
}

function CardEditor({ cards, onCardsChange }: CardEditorProps) {
  const classes = useStyles();

  const [isAdding, setIsAdding] = useState(false);

  function getHandleCardChange(index: number) {
    return function handleCardChange(next: number) {
      if (cards.indexOf(next) > -1) {
        return false;
      }
      const newCards = [...cards];
      newCards[index] = next;
      onCardsChange(newCards.sort((a, b) => a - b));
    };
  }

  function getHandleCardDelete(index: number) {
    return function handleCardDelete() {
      onCardsChange(cards.filter((_, i) => index !== i));
    };
  }

  function handleAddClick() {
    setIsAdding(true);
  }

  function handleAddChange(value: number) {
    if (cards.indexOf(value) > -1) {
      return false;
    }

    onCardsChange([...cards, value].sort((a, b) => a - b));
    setIsAdding(false);
  }

  function handleAddAction() {
    setIsAdding(false);
  }

  return (
    <Grid container spacing={1}>
      {cards.map((card, index) => (
        <Grid item key={card} xs={4} sm={3} md={2}>
          <EditableCard
            card={card}
            onChange={getHandleCardChange(index)}
            onAction={getHandleCardDelete(index)}
          />
        </Grid>
      ))}
      <Grid item key="ADD" xs={4} sm={3} md={2}>
        <Card>
          {isAdding ? (
            <EditableCard
              onChange={handleAddChange}
              onAction={handleAddAction}
              icon={<ClearIcon />}
              autoFocus
            />
          ) : (
            <CardActionArea onClick={handleAddClick}>
              <CardContent className={classes.addCard}>
                <AddIcon />
              </CardContent>
            </CardActionArea>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

export type { CardEditor };
export default CardEditor;
