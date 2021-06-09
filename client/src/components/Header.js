import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { Notifications } from "./Notifications";

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
          {currentUser ? <SearchBar /> : null}
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
                <Notifications />
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  aria-controls="account-menu"
                  color="inherit"
                  onClick={handleAccountClick}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="account-menu"
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
