const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

//Create Post

router.post("/", async (req, res) => {
  console.log(req.body);
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update Post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can only edit your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete Post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted....");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You Can Only Delete Your Posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All Post

router.get("/", async (req, res) => {
  const username = req.query.user;
  const catname = req.query.cat;
  try {
    let posts;
    if (username) {
      try {
        posts = await Post.find({ username });
      } catch (error) {
        res.status(500).json(error);
      }
    } else if (catname) {
      try {
        posts = await Post.find({
          categories: {
            $in: [catname],
          },
        });
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
