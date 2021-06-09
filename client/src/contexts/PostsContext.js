import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const PostsContext = createContext();

export const usePosts = () => {
  return useContext(PostsContext);
};

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/posts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    getPosts();
  }, []);

  const setPostsFunc = (postsToAdd) => {
    setPosts(postsToAdd);
  };

  const value = {
    posts,
    setPostsFunc,
    getPosts,
  };

  return (
    <PostsContext.Provider value={value}>
      {posts.length > 0 && children}
    </PostsContext.Provider>
  );
};
