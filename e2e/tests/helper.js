const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, blogObject) => {
  // Click create new button
  await page.getByRole("button", { name: "create new blog" }).click();
  // Add data in form
  await page.getByTestId("title").fill(blogObject.title);
  await page.getByTestId("author").fill(blogObject.author);
  await page.getByTestId("url").fill(blogObject.url);
  // Create
  await page.getByRole("button", { name: "Create" }).click();
};

export { loginWith, createBlog };
