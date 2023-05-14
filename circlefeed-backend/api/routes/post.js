const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");

//Routes

// get all posts
router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.commentedBy", "_id name pic")
    .sort("-createdAt")
    .exec()
    .then((posts) => {
      const noofPosts = posts.length;
      if (noofPosts <= 0) {
        return res
          .status(200)
          .json({ status: "Success", message: "No Posts available", posts });
      }
      const response = {
        status: "Success",
        message: "All records",
        count: noofPosts,
        posts,
      };
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(422)
        .json({ error: err, message: "Error occured in fetching data" });
    });
});

// My following posts
router.get("/myfollowingposts", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } }) // condition : if postedBy in following
    .populate("postedBy", "_id name pic")
    .populate("comments.commentedBy", "_id name")
    .sort("-createdAt")
    .exec()
    .then((posts) => {
      const noofPosts = posts.length;
      if (noofPosts <= 0) {
        return res
          .status(200)
          .json({ status: "Success", message: "No Posts available" });
      }
      const response = {
        status: "Success",
        message: "All records",
        count: noofPosts,
        posts,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(422)
        .json({ error: err, message: "Error occured in fetching data" });
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    let response = { status: "failed", message: "Please fill all the fields" };
    return res.status(422).json(response);
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Successfully Posted",
        post: result,
      });
    })
    .catch((err) => console.log(err));
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.status(200).json({ mypost });
    })
    .catch((err) => console.log(err));
});

// route for like, @update route
router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.status(200).json(result);
    }
  });
});

// route for unlike, @update route
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.status(200).json(result);
    }
  });
});

// route for comment, @update route
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    commentedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.commentedBy", "_id name pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.status(200).json(result);
      }
    });
});

//route for delete a post
router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec(async (err, post) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      if (!post) {
        return res.status(422).json({ error: "not found post" });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        try {
          let result = await post.remove();
          res
            .status(200)
            .json({ message: "Succeessfully deleted", data: result });
        } catch (err) {
          res.status(422).json({ error: err });
        }
      }
    });
});
module.exports = router;
