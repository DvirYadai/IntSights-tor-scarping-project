import axios from "axios";
import React, { useEffect, useState } from "react";
import { Post } from "../components/Post";

export const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/posts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </div>
  );
};
