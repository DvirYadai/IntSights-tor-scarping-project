import React, { useRef, useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { fade, makeStyles } from "@material-ui/core/styles";
import { usePosts } from "../contexts/PostsContext";

const useStyles = makeStyles((theme) => ({
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
}));

export const SearchBar = () => {
  const classes = useStyles();
  const searchValue = useRef();
  const [searchOption, setSearchOption] = useState("title");
  const { posts, setPostsFunc, getPosts } = usePosts();

  const handleSearch = () => {
    console.log("search");
    console.log(searchValue.current.value);
    const regex = new RegExp(searchValue.current.value);
    let searchResults;
    if (searchOption === "title") {
      searchResults = posts.filter((post) => {
        return regex.test(post.title);
      });
    } else {
      searchResults = posts.filter((post) => {
        return regex.test(post.body);
      });
    }
    if (searchResults.length > 0) {
      setPostsFunc(searchResults);
    } else {
      alert("Search results: 0");
    }
  };

  return (
    <div className={classes.grow}>
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
          inputRef={searchValue}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          onChange={(e) => e.target.value === "" && getPosts()}
        />
        <select
          name="search-options"
          id="search-options"
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="content">Content</option>
        </select>
      </div>
    </div>
  );
};
