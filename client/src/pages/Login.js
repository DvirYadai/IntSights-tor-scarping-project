import React from "react";
import "../App.css";
import img from "../img/Why-The-Iceberg-29.png";

export const Login = () => {
  return (
    <div className="login-div">
      <h1>Please login to enter the dashboard</h1>
      <img src={img} alt="logo" />
    </div>
  );
};
