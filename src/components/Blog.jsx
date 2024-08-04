import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs }) => {
  const [visible, setVisible] = useState(false)

  const handleVisibility = () => {
    setVisible(!visible)
  }

  const showDeleteButton = () => {
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))
    return loggedUser && blog.user === loggedUser.id
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.like(blog)
      setBlogs((blogs) =>
        blogs.map((b) => (b.id === blog.id ? updatedBlog : b))
      )
    } catch (error) {
      console.error('Failed to like blog', error)
      // Handle the error in a user-friendly way
    }
  }

  const handleDelete = async () => {
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs((blogs) => blogs.filter((b) => b.id !== blog.id))
    } catch (error) {
      console.error('Failed to delete blog', error)
      // Handle the error in a user-friendly way
    }
  }

  return (
    <div>
      {blog.title} {blog.author}
      <button onClick={handleVisibility}>view</button>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}</div>
        </div>
      )}
      <button onClick={handleLike}>like</button>
      {showDeleteButton() && <button onClick={handleDelete}>remove</button>}
    </div>
  )
}

export default Blog
