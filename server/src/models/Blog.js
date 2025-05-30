const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      default:
        "https://ars.els-cdn.com/content/image/1-s2.0-S2405844024028548-gr2.jpg",
    },
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;