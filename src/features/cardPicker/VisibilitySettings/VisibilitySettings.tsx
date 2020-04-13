import React, { ChangeEvent, FormEvent, useState } from "react";
import { isEmpty, isLoaded } from "react-redux-firebase";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";

import { RoomMember } from "../redux/types";
import { useProfile, useAuth } from "../../auth";

import useStyles from "./VisibilitySettings.styles";

interface VisibilitySettingsProps {
  member: RoomMember;
  onSave: (roomMember: RoomMember) => void;
  onReadyClick: (ready: boolean) => void;
}

function VisibilitySettings({
  member,
  onSave,
  onReadyClick,
}: VisibilitySettingsProps) {
  const { displayName, avatarUrl, isReady } = member;

  const auth = useAuth();
  const profile = useProfile();

  const classes = useStyles();

  const [name, setName] = useState(displayName);
  const [shouldShowAvatar, setShouldShowAvatar] = useState(!!avatarUrl);

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
      ...member,
      displayName: newName,
      avatarUrl:
        newShowAvatar && isLoaded(profile) && !isEmpty(profile)
          ? profile.avatarUrl
          : undefined,
    });
  }

  function handleReadyClick() {
    onReadyClick(!isReady);
  }

  return (
    <Card>
      <CardHeader title="Setup" />
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
                disabled={!isLoaded(auth) || auth.isAnonymous}
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
    </Card>
  );
}

export type { VisibilitySettingsProps };
export default VisibilitySettings;
