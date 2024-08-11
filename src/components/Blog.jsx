import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, setBlogs }) => {
  const [visible, setVisible] = useState(false);

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const showDeleteButton = () => {
    const loggedUser = JSON.parse(window.localStorage.getItem("loggedUser"));
    return loggedUser && blog.user === loggedUser.id;
  };

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.like(blog);
      setBlogs((blogs) =>
        blogs.map((b) => (b.id === blog.id ? updatedBlog : b))
      );
    } catch (error) {
      console.error("Failed to like blog", error);
      // Handle the error in a user-friendly way
    }
  };

  const handleDelete = async () => {
    try {
      await blogService.deleteBlog(blog.id);
      setBlogs((blogs) => blogs.filter((b) => b.id !== blog.id));
    } catch (error) {
      console.error("Failed to delete blog", error);
      // Handle the error in a user-friendly way
    }
  };

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <p>{blog.author}</p>
      <button onClick={handleVisibility}>{visible ? "hide" : "view"}</button>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <div>likes {blog.likes}</div>
          <button data-testid="like-button" onClick={handleLike}>
            like
          </button>
        </div>
      )}

      {showDeleteButton() && <button onClick={handleDelete}>remove</button>}
    </div>
  );
};

export default Blog;
