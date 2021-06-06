import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export const Login = () => {
  const { login } = useAuth();
  const history = useHistory();

  const loginButton = async () => {
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
  return (
    <div>
      <button onClick={loginButton}>login</button>
    </div>
  );
};
