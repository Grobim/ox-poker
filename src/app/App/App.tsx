import "typeface-roboto";
import React, { useEffect, useMemo } from "react";
import { SnackbarProvider } from "notistack";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { useSyncedUserSettings } from "../../features/profile";

import HandleAnonymousSession from "../HandleAnonymousSession";
import Layout from "../Layout";
import SyncLastConnectedUser from "../SyncLastConnectedUser";
import { MainRoutes } from "../routes";
import { useDispatch } from "react-redux";

import slice from "../redux/slice";
import { useHasFab } from "../redux/hooks";

import useStyles from "./App.styles";

function App() {
  const dispatch = useDispatch();
  const userSettings = useSyncedUserSettings();
  const hasFab = useHasFab();

  const classes = useStyles();

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userSettings.darkMode ? "dark" : "light",
        },
      }),
    [userSettings]
  );

  useEffect(() => {
    dispatch(slice.actions.updateHasFab(false));
  }, [dispatch]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          classes={{ containerRoot: hasFab ? classes.snackbar : "" }}
        >
          <CssBaseline />
          <Layout>
            <MainRoutes />
          </Layout>
        </SnackbarProvider>
      </ThemeProvider>
      <HandleAnonymousSession />
      <SyncLastConnectedUser />
    </>
  );
}

export default App;
