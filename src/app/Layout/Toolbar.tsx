import { MouseEventHandler, ReactChild, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isEmpty, useFirebase } from "react-redux-firebase";
import clsx from "clsx";

import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialToolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { useProfile, useAuth } from "../../features/auth";

import useStyles from "./Toolbar.styles";

const useToolbarLinkStyles = makeStyles({
  navToolbar: {
    color: "inherit",
    textDecoration: "none",
    flexGrow: 1,
  },
});

interface ToolbarLinkProps extends Record<string, any> {
  to: string;
  children: ReactChild;
  className: string;
}

function ToolbarLink({ children, className, ...props }: ToolbarLinkProps) {
  const classes = useToolbarLinkStyles();

  return (
    <Link className={clsx(className, classes.navToolbar)} {...props}>
      {children}
    </Link>
  );
}

interface ToolbarProps {
  onMenuClick: MouseEventHandler;
}

function Toolbar({ onMenuClick }: ToolbarProps) {
  const location = useLocation();
  const firebase = useFirebase();

  const classes = useStyles();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profile = useProfile();
  const auth = useAuth();
  const buttonRef = useRef(null);

  function handleAvatarClick() {
    setIsMenuOpen(!isMenuOpen);
  }

  async function handleLogout() {
    await firebase.auth().signInAnonymously();
    setIsMenuOpen(false);
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <MaterialToolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap to="/" component={ToolbarLink}>
          OX Poker
        </Typography>
        {isEmpty(auth) || auth.isAnonymous ? (
          <Button
            color="inherit"
            component={Link}
            to={{ pathname: "/login", state: { from: location } }}
          >
            Login
          </Button>
        ) : (
          <>
            <IconButton
              className={classes.avatarContainer}
              onClick={handleAvatarClick}
              ref={buttonRef}
            >
              <Avatar
                src={profile.avatarUrl}
                alt={profile.displayName}
                className={classes.avatar}
              />
            </IconButton>
            <Menu
              open={isMenuOpen}
              anchorEl={buttonRef.current}
              onClose={handleAvatarClick}
            >
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </>
        )}
      </MaterialToolbar>
    </AppBar>
  );
}

export default Toolbar;
