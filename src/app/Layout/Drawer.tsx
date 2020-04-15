import Button from "@material-ui/core/Button";
import MaterialDrawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ForwardIcon from "@material-ui/icons/Forward";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import clsx from "clsx";
import React, {
  ElementRef,
  forwardRef,
  MouseEventHandler,
  ReactChild,
} from "react";
import { NavLink } from "react-router-dom";

import { useIsRole, Role } from "../../features/auth";

import useStyles from "./Layout.styles";

interface DrawerProps {
  mobileOpen: boolean;
  onMenuClose: MouseEventHandler;
}

interface NavListItemProps extends Record<string, any> {
  to: string;
  children: ReactChild;
  className: string;
}

function Drawer({ mobileOpen, onMenuClose }: DrawerProps) {
  const classes = useStyles();

  const isAdmin = useIsRole(Role.ADMIN);

  function NavListItem(
    { className, ...props }: NavListItemProps,
    ref: ElementRef<any>
  ) {
    return (
      <Button
        className={clsx(className, classes.navItem)}
        component={NavLink}
        onClick={onMenuClose}
        ref={ref}
        activeClassName={classes.activeLink}
        {...props}
      />
    );
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List component="div">
        <ListItem component={forwardRef(NavListItem)} to="/local">
          <ListItemIcon>
            <ForwardIcon />
          </ListItemIcon>
          <ListItemText primary="Local" />
        </ListItem>
        <ListItem component={forwardRef(NavListItem)} to="/online">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Online" />
        </ListItem>
      </List>
      <Divider />
      {isAdmin && (
        <ListItem component={forwardRef(NavListItem)} to="/users">
          <ListItemIcon>
            <SupervisorAccountIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
      )}
      <List component="div">
        <ListItem component={forwardRef(NavListItem)} to="/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden mdUp>
        <MaterialDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMenuClose}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
          role="navigation"
        >
          {drawer}
        </MaterialDrawer>
      </Hidden>
      <Hidden smDown>
        <MaterialDrawer
          open
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          role="navigation"
        >
          {drawer}
        </MaterialDrawer>
      </Hidden>
    </nav>
  );
}

export default Drawer;
