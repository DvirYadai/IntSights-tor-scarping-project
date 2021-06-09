import React, { useEffect, useRef, useState } from "react";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { List } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import { searchKeywordsFunc } from "../utils/searchKeywords";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import socket from "../socketConfig";
import { usePosts } from "../contexts/PostsContext";

export const Notifications = () => {
  const { currentUser } = useAuth();
  const { getPosts } = usePosts();
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notification, setNotification] = useState([]);
  const newPosts = useRef([]);

  useEffect(async () => {
    if (!currentUser) {
      return;
    }
    socket.on("scraperUpdate", (data) => {
      if (data.newPostsCount > 0) {
        getPosts();
        newPosts.current = [...data.newPosts, ...newPosts.current];
      }
      setNotificationCount((prev) => (prev += 1));
      setNotification((prev) => [data.message, ...prev]);
    });
    return () => socket.close();
  }, [currentUser]);

  useEffect(async () => {
    if (!currentUser) {
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/v1/user?uid=${currentUser.uid}`
      );
      const interval = setInterval(() => {
        if (newPosts.current.length > 0) {
          const matches = searchKeywordsFunc(newPosts.current, data.keywords);
          if (matches.length > 0) {
            setNotificationCount((prev) => (prev += matches.length));
            const strings = matches.map((match) => {
              return `You have a ${match.match} to your word: ${match.keyword}, on a post with this title: ${match.post.title}`;
            });
            setNotification((prev) => [...strings, ...prev]);
          }
          newPosts.current = [];
        }
      }, data.searchInterval * 60000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
    }
  }, [currentUser]);

  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationCount(0);
    setNotification([]);
    setAnchorElNotification(null);
  };

  return (
    <>
      <IconButton
        aria-label="show new notifications"
        color="inherit"
        aria-controls="notification-menu"
        onClick={handleNotificationClick}
      >
        <Badge badgeContent={notificationCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorElNotification}
        keepMounted
        open={Boolean(anchorElNotification)}
        onClose={handleNotificationClose}
      >
        <List>
          {notification.length > 0 ? (
            notification.map((not, i) => (
              <div key={i}>
                <ListItem>
                  <ListItemText primary={not} />
                </ListItem>
                <Divider />
              </div>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="You don't have notifications" />
            </ListItem>
          )}
        </List>
      </Menu>
    </>
  );
};
