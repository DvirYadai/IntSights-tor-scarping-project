import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/v1/user?uid=${currentUser.uid}`
      );
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {!loading && children}
    </UserContext.Provider>
  );
};
