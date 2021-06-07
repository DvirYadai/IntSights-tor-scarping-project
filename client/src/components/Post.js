import React from "react";

export const Post = ({ post }) => {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p>Posted by: {post.author}</p>
      <p>Created at: {post.date}</p>
    </div>
  );
};
