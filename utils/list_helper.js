const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((previous, current) => previous + current.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((previous, current) =>
    previous.likes < current.likes
      ? { title: current.title, author: current.author, likes: current.likes }
      : {
          title: previous.title,
          author: previous.author,
          likes: previous.likes,
        }
  );
};

const mostBlogs = (blogs) => {
  const statistics = countBlogs(blogs);
  const most = statistics.reduce((highest, current) =>
    highest.blogs > current.blogs ? highest : current
  );

  return most;
};

const countBlogs = (blogs) => {
  let statistics = [];

  blogs.forEach((blog) => {
    if (statistics.some((statistic) => statistic.author === blog.author)) {
      const target = statistics.find(
        (counter) => counter.author === blog.author
      );
      target.blogs += 1;
    } else {
      statistics.push({
        author: blog.author,
        blogs: 1,
      });
    }
  });

  return statistics;
};

const mostLikes = (blogs) => {
  const statistics = countLikes(blogs);
  const highestLikes = statistics.reduce((highest, current) =>
    highest.likes > current.likes ? highest : current
  );
  return highestLikes;
};

const countLikes = (blogs) => {
  let statistics = [];

  blogs.forEach((blog) => {
    if (statistics.some((statistic) => statistic.author === blog.author)) {
      const target = statistics.find(
        (statistic) => statistic.author === blog.author
      );
      target.likes += blog.likes;
    } else {
      statistics.push({
        author: blog.author,
        likes: blog.likes,
      });
    }
  });

  return statistics;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
