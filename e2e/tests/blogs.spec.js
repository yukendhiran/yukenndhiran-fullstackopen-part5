const { test, expect, beforeEach, describe } = require("@playwright/test");
const loginWith = require("./helper").loginWith;
const createBlog = require("./helper").createBlog;

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:5173/api/testing/reset");
    await request.post("http://localhost:5173/api/users", {
      data: {
        name: "sekret",
        username: "sekret",
        password: "sekret",
      },
    });
    // two user in db
    await request.post("http://localhost:5173/api/users", {
      data: {
        name: "user",
        username: "user",
        password: "user",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // Check if title is show
    await expect(page.getByText("Login in to application")).toBeVisible();
    // Check Inputs
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succedes with correct credentials", async ({ page }) => {
      await loginWith(page, "sekret", "sekret");

      await expect(page.getByText("sekret logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "sekret", "user");

      await expect(page.getByText("Login in to application")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      // Write credentials
      await loginWith(page, "sekret", "sekret");
    });

    test("a new blog can be create", async ({ page }) => {
      const newBlog = {
        title: "Test blog",
        author: "tset",
        url: "test.com",
      };
      await createBlog(page, newBlog);
      // Validate
      await expect(page.getByText("Test blog")).toBeVisible();
    });

    describe("When new blog is created", () => {
      beforeEach(async ({ page }) => {
        const newBlog = {
          title: "Test blog",
          author: "tset",
          url: "test.com",
        };
        await createBlog(page, newBlog);
      });

      test("Can increment like blog", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();

        await expect(page.getByText("0")).toBeVisible();

        await page.getByRole("button", { name: "like" }).click();

        await expect(page.getByText("1")).toBeVisible();
      });

      test("Can delete own blog", async ({ page }) => {
        await expect(
          page.getByRole("button", { name: "remove" })
        ).toBeVisible();

        await page
          .getByRole("button", { name: "remove" })
          .click()
          .toHaveCount(0);
      });

      test("Cannot delete blog of other user", async ({ page }) => {
        await page.getByRole("button", { name: "Logout" }).click();
        await loginWith(page, "user", "user");

        await expect(page.getByRole("button", { name: "remove" })).toHaveCount(
          0
        );
      });

      test("Check that first blog has more likes", async ({ page }) => {
        const otherBlog = {
          title: "Test blog1",
          author: "tset",
          url: "test.com",
        };
        await createBlog(page, otherBlog);

        const firstBlogCreated = await page.getByText("Test blog");
        const locatorFirst = await firstBlogCreated.locator("..");
        await locatorFirst.getByRole("button", { name: "view" }).click();

        const secondBlogCreated = await page.getByText("Test blog1");
        const locatorSecond = await secondBlogCreated.locator("..");

        await locatorSecond.getByRole("button", { name: "view" }).click();

        await locatorSecond.getByRole("button", { name: "like" }).click();
        // Check order of blogs
        const listBlogs = await page.getByTestId("blog card");
        const firstBlog = await listBlogs.nth(0).getByText("Test blog");
        await expect(firstBlog).toBeVisible();
      });
    });
  });
});
