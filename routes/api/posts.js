const express   = require('express');
const router    = express.Router();
const {check, validationRequest} = require('express-validator/check');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const auth  = require('../../middlewares/auth');

// POST /api/posts/
// @desc Create a new post
// Private
router.post('/', [ auth, 
[
    check('text', 'Text is required').not().isEmpty()
]
],
async(req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const {text, comments} = req.body;

        const userId = user.id;
        const name   = user.username;
        const avatar = user.avatar;
        const newPost = new Post({ userId, name, text, avatar})
        await newPost.save()
        console.log("New Post created")
        return res.send(newPost)
    } catch (err) {
        return res.status(500).send('Server Error');
    }
})


module.exports = router;

