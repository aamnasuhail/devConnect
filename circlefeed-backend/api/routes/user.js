const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');


// profile of other user
router.get('/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err });
                    } else {
                        return res.status(200).json({ message: 'Successfully get posts', user, posts });
                    }
                })
        })
        .catch(err => {
            return res.status(404).json({ message: "User not found", error: err });
        })
})

//update pic of user
router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true, select: "_id pic name email" },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "pic not updated", err });
            }
            res.status(200).json({ message: "Successfully updated", result });
        })
})

// follow route
router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }

            User.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, { new: true }).select("-password").then(result => {
                return res.status(200).json(result);
            }).catch(err => {
                return res.status(422).json({ error: err });
            })
        })
})

// Unfollow Route
router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }

            User.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.unfollowId }
            }, { new: true }).select("-password").then(result => {
                return res.status(200).json(result);
            }).catch(err => {
                return res.status(422).json({ error: err });
            })
        })
})

//search users
router.post('/findusers', (req, res) => {
    let userPattern = new RegExp("^" + req.body.query);
    User.find({ email: { $regex: userPattern } })
        .select('_id email name pic')
        .then(users => {
            if (!users) {
                return res.status(422).json({ error: 'Users not exist' });
            }
            return res.status(200).json({ users });
        })
        .catch(err => {
            return res.status(422).json({ error: 'User not exist', err });
        })
})

module.exports = router;