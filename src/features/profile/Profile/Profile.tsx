import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { isEmpty, isLoaded, useFirebase } from "react-redux-firebase";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";

import EditIcon from "@material-ui/icons/Edit";

import { useProfile, useAuth, UserProfile } from "../../auth";

import { triggerUserSettingsUpdate, useSyncedUserSettings } from "..";

import useStyles from "./Profile.styles";

function Profile() {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const auth = useAuth();
  const profile = useProfile();
  const { darkMode = false } = useSyncedUserSettings();

  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | void>();
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [showAvatar, setShowAvatar] = useState<boolean>(
    profile.showAvatar || false
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const classes = useStyles();

  useEffect(() => {
    if (isLoaded(profile)) {
      setDisplayName(profile.displayName);
      setAvatarUrl(profile.avatarUrl);
      setShowAvatar(profile.showAvatar || false);
    }
  }, [profile]);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = (event.target.files || [])[0];

    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  }

  function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();

    updateProfile();
  }

  function handleDisplayNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDisplayName(event.target.value);
  }

  function handleShowAvatarChange() {
    setShowAvatar(!showAvatar);
  }

  function handleDarkModeChange(_: ChangeEvent, value: boolean) {
    dispatch(triggerUserSettingsUpdate({ darkMode: value }));
  }

  async function updateProfile() {
    const profileUpdates: Partial<UserProfile> = {};

    if (displayName && displayName !== profile.displayName) {
      profileUpdates.displayName = displayName;
    }

    if (showAvatar !== profile.showAvatar) {
      profileUpdates.showAvatar = showAvatar;
    }

    if (Object.keys(profileUpdates).length) {
      firebase.updateProfile(profileUpdates);
    }

    if (avatarFile) {
      const fileRef = firebase
        .storage()
        .ref(`avatars/${auth.uid}/${avatarFile.name}`);

      const snapshot = await fileRef.put(avatarFile);
      const downloadUrl = await snapshot.ref.getDownloadURL();

      setAvatarUrl(downloadUrl);
      setAvatarFile();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      firebase.updateProfile({ avatarUrl: downloadUrl });

      const filesRes = await firebase
        .storage()
        .ref(`avatars/${auth.uid}`)
        .listAll();

      await Promise.allSettled(
        filesRes.items
          .filter((file) => file.fullPath !== fileRef.fullPath)
          .map((fileRef) => fileRef.delete())
      );
    }
  }

  if (!isLoaded(auth) || isEmpty(auth)) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Typography variant="h4" noWrap gutterBottom>
        Profile
      </Typography>
      <Grid container direction="column" spacing={3}>
        {!auth.isAnonymous && isLoaded(profile) && (
          <>
            <Grid item>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleProfileSubmit}
              >
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Avatar
                      src={avatarUrl}
                      className={classes.avatar}
                      alt="Avatar"
                    />
                  </Grid>
                  <Grid container item justify="center">
                    <Button
                      variant="contained"
                      className={classes.avatarButton}
                    >
                      Upload avatar
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className={classes.avatarInput}
                        onChange={handleAvatarChange}
                      />
                    </Button>
                  </Grid>
                  <Grid item>
                    <TextField
                      value={displayName}
                      label="Display name"
                      onChange={handleDisplayNameChange}
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      label="Show avatar in online rooms"
                      control={
                        <Switch
                          checked={showAvatar}
                          onChange={handleShowAvatarChange}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
          </>
        )}
        <Grid item>
          <FormControlLabel
            label="Dark Mode"
            control={
              <Switch checked={darkMode} onChange={handleDarkModeChange} />
            }
          />
        </Grid>
      </Grid>
      <Zoom
        in={
          !auth.isAnonymous &&
          ((displayName && displayName !== profile.displayName) ||
            showAvatar !== Boolean(profile.showAvatar) ||
            Boolean(avatarFile))
        }
      >
        <Fab onClick={updateProfile} className={classes.fab} color="primary">
          <EditIcon />
        </Fab>
      </Zoom>
    </>
  );
}

export default Profile;
