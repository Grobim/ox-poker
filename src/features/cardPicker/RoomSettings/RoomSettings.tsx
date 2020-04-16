import React, {
  ChangeEvent,
  FormEvent,
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useState,
  useMemo,
} from "react";
import firebase from "firebase/app";
import isEqual from "lodash/isEqual";

import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import type { TransitionProps } from "@material-ui/core/transitions/transition";
import Typography from "@material-ui/core/Typography";

import EditIcon from "@material-ui/icons/Edit";

import { Room, SpecialCard } from "../redux/types";

// @ts-ignore
import AsyncSha256 from "../AsyncSha256";
import CardEditor from "../CardEditor";

import useStyles from "./RoomSettings.styles";

// @ts-ignore
const sha256 = new AsyncSha256();

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface RoomSettingsProps {
  room: Room;
  expanded: boolean;
  onSave: (roomMember: firebase.firestore.UpdateData) => void;
  onCloseClick: () => void;
}

function RoomSettings({
  room,
  expanded,
  onSave,
  onCloseClick,
}: RoomSettingsProps) {
  const classes = useStyles();

  const header = <CardHeader title="Room Settings" />;

  const [roomName, setRoomName] = useState(room.displayName || "");
  const [password, setPassword] = useState<string | void>();
  const [openEditModal, setOpenEditModal] = useState(false);

  const editableCards = useMemo(
    () => room.cards.filter((card) => typeof card === "number") as number[],
    [room]
  );
  const editableCardsText = useMemo(() => editableCards.join(", "), [
    editableCards,
  ]);

  const [editCards, setEditCards] = useState(editableCards);

  useEffect(() => {
    setRoomName(room.displayName || "");
    setEditCards(editableCards);
    setPassword();
  }, [room, editableCards]);

  function handleRoomNameChange(event: ChangeEvent<HTMLInputElement>) {
    setRoomName(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleCloseClick() {
    saveRoom();
    onCloseClick();
  }

  function handleSettingsSubmit(event: FormEvent) {
    event.preventDefault();

    saveRoom();
  }

  function handleEditCardsClick() {
    setOpenEditModal(true);
  }

  function handleEditModalClose() {
    setOpenEditModal(false);
    setEditCards(editableCards);
  }

  function handleCardsChange(cards: number[]) {
    setEditCards(cards);
  }

  function handleEditModalSave() {
    saveRoom();
    setOpenEditModal(false);
  }

  function saveRoom() {
    const roomChanges: firebase.firestore.UpdateData = {};

    if (roomName !== room.displayName) {
      roomChanges.displayName =
        roomName || firebase.firestore.FieldValue.delete();
    }

    if (typeof password === "string") {
      roomChanges.passwordHash = password
        ? sha256.sdigest(password)
        : firebase.firestore.FieldValue.delete();
    }

    if (!isEqual(editableCards, editCards)) {
      roomChanges.cards = [...editCards, SpecialCard.LONG, SpecialCard.PAUSE];
    }

    const { passwordHash, ...roomRest } = room;

    onSave({
      ...roomRest,
      ...roomChanges,
    });
  }

  return (
    <>
      {expanded ? (
        header
      ) : (
        <CardActionArea onClick={handleCloseClick}>{header}</CardActionArea>
      )}
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSettingsSubmit}
              >
                <TextField
                  value={roomName}
                  label="Name"
                  onChange={handleRoomNameChange}
                  fullWidth
                />
              </form>
            </Grid>
            <Grid item xs={12}>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSettingsSubmit}
              >
                <TextField
                  type="password"
                  value={password || ""}
                  label="Password"
                  onChange={handlePasswordChange}
                  fullWidth
                />
              </form>
            </Grid>
            <Grid
              item
              xs={12}
              container
              spacing={1}
              alignItems="center"
              className={classes.cardList}
            >
              <Grid item>
                <Typography component="span">
                  Cards: {editableCardsText}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={handleEditCardsClick} size="small">
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            className={classes.closeButton}
            onClick={handleCloseClick}
          >
            Save
          </Button>
        </CardActions>
      </Collapse>
      <Dialog
        open={openEditModal}
        onClose={handleEditModalClose}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <CardEditor cards={editCards} onCardsChange={handleCardsChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export type { RoomSettingsProps };
export default RoomSettings;
