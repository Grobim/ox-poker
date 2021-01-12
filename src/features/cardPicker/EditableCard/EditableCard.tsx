import { ChangeEvent, useState } from "react";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import DeleteIcon from "@material-ui/icons/Delete";

import useStyles from "./EditableCard.styles";

interface EditableCardProps {
  card?: number;
  onChange: (value: number) => boolean | void;
  onAction: () => void;
  icon?: JSX.Element;
  autoFocus?: boolean;
}

function EditableCard({
  card = 1,
  onChange,
  onAction: onDelete,
  icon = <DeleteIcon />,
  autoFocus,
}: EditableCardProps) {
  const classes = useStyles();

  const [value, setValue] = useState(card);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(Math.max(0, Math.min(event.target.valueAsNumber || 0, 999)));
  }

  function handleBlur() {
    const changed = onChange(value);
    if (changed === false) {
      setValue(card);
    }
  }

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <TextField
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
          type="number"
          className={classes.input}
          inputProps={{ className: classes.input }}
          autoFocus={autoFocus}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton size="small" className={classes.delete} onClick={onDelete}>
          {icon}
        </IconButton>
      </CardActions>
    </Card>
  );
}

export type { EditableCardProps };
export default EditableCard;
