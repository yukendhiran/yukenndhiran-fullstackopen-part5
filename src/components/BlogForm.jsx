import { useState } from "react";
import blogService from "../services/blogs";

const CreateBlogForm = ({ setBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [notify, setNotify] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newBlog = { title, author, url };
      const returnedBlog = await blogService.create(newBlog);
      setBlog((blogs) => [...blogs, returnedBlog]);
      setTitle("");
      setAuthor("");
      setUrl("");
      setNotify("Blog created");
      setTimeout(() => {
        setNotify(null);
      }, 5000);
    } catch (exception) {
      console.error("Failed to create blog", exception);
    }
  };

  return (
    <div>
      {notify && <div style={{ color: "green" }}>{notify}</div>}
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label>URL:</label>
          <input
            type="text"
            name="Url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
