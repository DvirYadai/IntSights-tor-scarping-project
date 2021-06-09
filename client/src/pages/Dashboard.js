import React from "react";
import { Post } from "../components/Post";
import { usePosts } from "../contexts/PostsContext";

export const Dashboard = () => {
  const { posts } = usePosts();

  return (
    <div className="posts-div">
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </div>
  );
};
