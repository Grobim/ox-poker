import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { isEmpty, isLoaded } from "react-redux-firebase";
import firebase from "firebase/app";

import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";

import { useAuth, useProfile } from "../../auth";

import { RoomMember } from "../redux/types";

import useStyles from "./VisibilitySettings.styles";

interface VisibilitySettingsProps {
  member: RoomMember;
  onSave: (roomMember: firebase.firestore.UpdateData) => void;
  onReadyClick?: (ready: boolean) => void;
  expanded: boolean;
}

function VisibilitySettings({
  member,
  onSave,
  onReadyClick,
  expanded,
}: VisibilitySettingsProps) {
  const { displayName, isReady } = member;

  const auth = useAuth();
  const profile = useProfile();

  const classes = useStyles();
  const header = <CardHeader title="Setup" />;

  const [name, setName] = useState(displayName);
  const [shouldShowAvatar, setShouldShowAvatar] = useState(profile.showAvatar);
  const [isExpanded, setIsExpanded] = useState(expanded);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    saveVisibility();
  }

  function handleAvatarVisibilityChange() {
    setShouldShowAvatar(!shouldShowAvatar);
    saveVisibility(name, !shouldShowAvatar);
  }

  function handleInputBlur() {
    saveVisibility();
  }

  function saveVisibility(newName = name, newShowAvatar = shouldShowAvatar) {
    onSave({
      displayName: newName,
      avatarUrl:
        newShowAvatar && isLoaded(profile) && !isEmpty(profile)
          ? profile.avatarUrl
          : undefined,
    });
  }

  function handleReadyClick() {
    onReadyClick && onReadyClick(!isReady);

    if (!member.isReady) {
      setIsExpanded(false);
    }
  }

  function handleHeaderClick() {
    setIsExpanded(!isExpanded);

    if (!isExpanded) {
      onReadyClick && onReadyClick(false);
    }
  }

  return (
    <>
      {!isExpanded ? (
        <CardActionArea onClick={handleHeaderClick}>{header}</CardActionArea>
      ) : (
        header
      )}
      <Collapse in={isExpanded} timeout="auto">
        <CardContent>
          <form noValidate autoComplete="off" onSubmit={handleFormSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  value={name}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  label="Display name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  disabled={
                    !isLoaded(auth) || auth.isAnonymous || !isLoaded(profile)
                  }
                  label="Show avatar"
                  control={
                    <Switch
                      checked={shouldShowAvatar}
                      onChange={handleAvatarVisibilityChange}
                    />
                  }
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            variant="contained"
            className={classes.readyButton}
            disabled={!name}
            onClick={handleReadyClick}
          >
            Ready
          </Button>
        </CardActions>
      </Collapse>
    </>
  );
}

export type { VisibilitySettingsProps };
export default VisibilitySettings;
