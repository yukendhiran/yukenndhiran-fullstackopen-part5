import axios from 'axios'

const baseUrl = '/api/blogs'

const getToken = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser') // Ensure this key is correct
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    return user.token
  }
  return null
}

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch (error) {
    console.error('Failed to fetch blogs', error)
    throw error // Rethrow to handle in component
  }
}

const create = async (newBlog) => {
  const token = getToken()
  if (!token) {
    throw new Error('No token found')
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 5000, // Optional: set a timeout for requests
  }

  try {
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
  } catch (error) {
    console.error('Failed to create blog', error)
    throw error // Rethrow to handle in component
  }
}

const like = async (blog) => {
  if (!blog.id) {
    throw new Error('Blog ID is missing')
  }

  const user = JSON.parse(window.localStorage.getItem('loggedUser'))
  const blogData = {
    ...blog,
    likes: blog.likes + 1,
    user: user.id,
  }

  try {
    const response = await axios.put(`${baseUrl}/${blog.id}`, blogData)
    return response.data
  } catch (error) {
    console.error('Failed to update blog', error)
    throw error // Rethrow to handle in component
  }
}

const deleteBlog = async (id) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('No token found')
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000, // Optional: set a timeout for requests
    }

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  } catch (error) {
    console.error('Failed to delete blog', error)
    throw error // Rethrow to handle in component
  }
}

const blogService = {
  getAll,
  create,
  like,
  deleteBlog,
}

export default blogService
