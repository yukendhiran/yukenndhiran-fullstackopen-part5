import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglabel'
import LoginForm from './components/LoginForm'
const App = () => {
  const [blogList, setBlogList] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notify, setNotify] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAll()
        const sortedBlogs = data.sort((a, b) => b.likes - a.likes)
        setBlogList(sortedBlogs)
      } catch (error) {
        console.error('Failed to fetch blogs', error)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      if (exception) {
        setNotify('Wrong credentials')
        setTimeout(() => {
          setNotify(null)
        }, 5000)
      } else {
        setNotify(null)
      }
    }
  }

  useEffect(() => {})

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notify && <div style={{ color: 'red' }}>{notify}</div>}
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <button onClick={handleLogout}>LogOut</button>

      <div>{user.username} logged in</div>
      <Togglable buttonLabel="create new blog">
        <BlogForm setBlog={setBlogList} />
      </Togglable>
      <h2>blogs</h2>
      {console.log(blogList)}
      {blogList.map((blog) => (
        <Blog key={blog.id} blog={blog} setBlogs={setBlogList} />
      ))}
    </div>
  )
}

export default App
