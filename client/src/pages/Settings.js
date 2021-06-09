import React, { useRef, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export const Settings = () => {
  const { currentUser } = useAuth();
  const wordRef = useRef();
  const intervalRef = useRef();
  const [words, setWords] = useState();
  const [interval, setInterval] = useState();
  const classes = useStyles();
  const [saved, setSaved] = useState(false);

  useEffect(async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/v1/user?uid=${currentUser.uid}`
      );
      if (res.data.keywords.length === 0) {
        setWords([]);
      } else setWords(res.data.keywords);
      setInterval(res.data.searchInterval);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleChipDelete = (chipToDelete) => () => {
    setSaved(false);
    setWords((words) => words.filter((word) => word !== chipToDelete));
  };

  const handleChipAdd = () => {
    if (wordRef.current.value === "") return;
    setSaved(false);
    setWords((prev) => [...prev, wordRef.current.value]);
    wordRef.current.value = "";
  };

  const handleIntervalChange = () => {
    setSaved(false);
    if (intervalRef.current.value < 1) {
      alert("interval cant be lower then 1");
      return;
    }
    setInterval(intervalRef.current.value);
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3001/api/v1/user/update", {
        uid: currentUser.uid,
        words,
        interval,
      });
      setSaved(true);
    } catch (error) {
      console.log(error);
      setSaved(false);
    }
  };

  return (
    <div className="settings-div">
      <h3>Keywords:</h3>
      <p>
        Keywords let you search any words every few minutes, you can determine
        the interval of the search.
      </p>
      <TextField id="outlined-basic" variant="outlined" inputRef={wordRef} />
      <Button id="add-word-button" onClick={handleChipAdd}>
        Add
      </Button>
      <div className={classes.root}>
        {words &&
          words.map((word, i) => {
            return (
              <li key={i}>
                <Chip
                  label={word}
                  onDelete={handleChipDelete(word)}
                  className={classes.chip}
                />
              </li>
            );
          })}
      </div>
      <h3>Search interval (in minutes)</h3>
      <p>Determine how often the search will be executed</p>
      <TextField
        id="outlined-number"
        type="number"
        variant="outlined"
        onChange={handleIntervalChange}
        value={interval && interval}
        inputRef={intervalRef}
      />
      <p>You must refresh the page for the changes to take effect</p>
      <Button id="save-settings-button" onClick={handleSave}>
        {saved ? <CheckIcon /> : "Save"}
      </Button>
    </div>
  );
};
