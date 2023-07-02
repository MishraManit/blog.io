const blogController = require("express").Router();
const Blog = require("../models/Blog");
const verifyToken = require("../middlewares/verifyToken");

blogController.get("/getAll", async (req, res) => {
  try {
    const blogs = await Blog.find({ isVerfied: 1 }).populate(
      "userId",
      "-password"
    );
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.get("/getUnVerified", async (req, res) => {
  try {
    const blogs = await Blog.find({ isVerfied: 0 }).populate(
      "userId",
      "-password"
    );
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.get("/find/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "userId",
      "-password"
    );
    blog.views += 1;
    if (blog.views >= 10) {
      blog.featured = true;
    }
    console.log(blog);
    await blog.save();

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.get("/featured", async (req, res) => {
  try {
    const blogs = await Blog.find({ featured: true, isVerfied: 1 })
      .populate("userId", "-password")
      .sort({ views: -1 })
      .limit(4);
    // console.log(blogs);
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.get("/myblogs/:id", async (req, res) => {
  try {
    // const t = await Blog.find({ userId: req.body.id });
    // console.log(t);
    const blogs = await Blog.find({ userId: req.params.id }).populate(
      "userId",
      "-password"
    );

    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

blogController.post("/", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.put("/updateBlog/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can update only your own posts");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json(updatedBlog);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

blogController.post("/updateVerification", async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.body.id });

    blog.isVerfied = req.body.status;
    blog.rejectReason = req.body.rejectReason;
    await blog.save();
    return res.status(200).json(updatedBlog);
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.put("/likeBlog/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.likes.includes(req.user.id)) {
      blog.likes = blog.likes.filter((userId) => userId !== req.user.id);
      await blog.save();

      return res.status(200).json({ msg: "Successfully unliked the blog" });
    } else {
      blog.likes.push(req.user.id);
      await blog.save();

      return res.status(200).json({ msg: "Successfully liked the blog" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.delete("/deleteBlog/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can delete only your own posts");
    }

    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Successfully deleted the blog" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

blogController.get("/IsUnVerifiedBlogExists", async (req, res) => {
  try {
    const isVerifiedZero = await Blog.exists({ isVerfied: 0 });
    return res.status(200).json(isVerifiedZero ? true : false);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = blogController;
