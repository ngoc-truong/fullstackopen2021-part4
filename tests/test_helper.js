const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Frohes neues Jahr",
    author: "Ngoc Schung",
    url: "www.google.de",
    likes: 44,
  },
  {
    title: "Du bist gut genug!",
    author: "Ngoc Schung",
    url: "www.google.de",
    likes: 12,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { initialBlogs, blogsInDb };
