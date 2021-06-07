import React, { useEffect, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router";
import axios from "axios";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function Header() {
  const classes = useStyles();
  const { currentUser, logout, login } = useAuth();
  const history = useHistory();
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    newSocket.on("scraperUpdate", (data) => {
      setNotificationCount((prev) => (prev += 1));
    });
    return () => newSocket.close();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      const { user } = await login();
      await axios.post("http://localhost:3001/api/v1/user", {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        userImg: user.photoURL,
      });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountClick = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorElAccount(null);
  };

  const handleAccountSettings = () => {
    setAnchorElAccount(null);
    history.push("/settings");
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h5" noWrap>
            Stronghold Scraping
          </Typography>
          {currentUser ? (
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          ) : null}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {currentUser ? (
              <>
                <Button>
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    to="/"
                  >
                    Dashboard
                  </Link>
                </Button>{" "}
                <IconButton aria-label="show new notifications" color="inherit">
                  <Badge badgeContent={notificationCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  aria-controls="simple-menu"
                  color="inherit"
                  onClick={handleAccountClick}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorElAccount}
                  keepMounted
                  open={Boolean(anchorElAccount)}
                  onClose={handleAccountClose}
                >
                  <MenuItem onClick={handleAccountSettings}>Settings</MenuItem>
                </Menu>
              </>
            ) : null}
            <Button
              style={{ marginLeft: "1rem" }}
              onClick={currentUser ? handleLogout : handleLogin}
            >
              {currentUser ? "Log out" : "Login"}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
