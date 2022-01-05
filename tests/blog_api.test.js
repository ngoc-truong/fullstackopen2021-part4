const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("tests with initial blogs in it", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blog post have id field", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0]._id).not.toBeDefined();
    expect(response.body[0].id).toBeDefined();
  });
});

describe("addition of new blog post", () => {
  test("a blog post can be added", async () => {
    const newBlog = {
      title: "My new blog title",
      author: "Nockchan",
      url: "www.craneclane.de",
      likes: 14,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((blog) => blog.title);

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain("My new blog title");
  });
});

describe("Missing values in blog", () => {
  test("blogs without likes default to zero likes", async () => {
    const newBlog = {
      title: "My new blog title",
      author: "Nockchan",
      url: "www.craneclane.de",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  test("blogs without title or url are not added", async () => {
    const newBlog = {
      likes: 12,
      author: "Nockchan",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with 204 if id is valid", async () => {
    const blogsAtBeginning = await helper.blogsInDb();
    const blogToDelete = blogsAtBeginning[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("updating a blog post", () => {
  test("succeeds when updating a blog post", async () => {
    const blogsAtBeginning = await helper.blogsInDb();
    const blogToUpdate = blogsAtBeginning[0];

    const updatedBlog = {
      title:
        "Grün und weiß, das ist unser Team, Werder Brem' wir wollen dich siegen sehen",
      author: "Mule",
      url: "www.werder.de",
      likes: 32,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain(updatedBlog.title);

    expect(blogsAtBeginning).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
