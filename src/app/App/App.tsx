import "typeface-roboto";
import React, { useMemo } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { useSyncedUserSettings } from "../../features/profile";

import HandleAnonymousSession from "../HandleAnonymousSession";
import Layout from "../Layout";
import SyncLastConnectedUser from "../SyncLastConnectedUser";
import { MainRoutes } from "../routes";

function App() {
  const userSettings = useSyncedUserSettings();

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userSettings.darkMode ? "dark" : "light",
        },
      }),
    [userSettings]
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <MainRoutes />
        </Layout>
      </ThemeProvider>
      <HandleAnonymousSession />
      <SyncLastConnectedUser />
    </>
  );
}

export default App;
