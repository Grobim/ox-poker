import clsx from "clsx";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";

import { SpecialCard } from "../redux/types";

import useStyles from "./ClickableCard.styles";

interface ClickableCardProps {
  card: number | SpecialCard;
  className?: string;
  contentClassName?: string;
  onSelect: (selectedCard?: number | SpecialCard) => void;
  fontSize?: number | string;
}

function ClickableCard({
  card,
  className,
  onSelect,
  contentClassName,
  fontSize,
}: ClickableCardProps) {
  const classes = useStyles(fontSize);

  function handleCardClick() {
    onSelect(card);
  }

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionArea onClick={handleCardClick} className={classes.root}>
        <CardContent className={clsx(classes.content, contentClassName)}>
          <div className={classes.value}>
            {card === SpecialCard.LONG ? (
              <HourglassFullIcon className={classes.icon} />
            ) : card === SpecialCard.PAUSE ? (
              <LocalCafeIcon className={classes.icon} />
            ) : (
              <Typography className={classes.label} variant="h4">
                {card}
              </Typography>
            )}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export type { ClickableCardProps };
export default ClickableCard;
