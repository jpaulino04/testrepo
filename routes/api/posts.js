const express   = require('express');
const router    = express.Router();
const {check, validationRequest} = require('express-validator/check');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const auth  = require('../../middlewares/auth');

router.post('/', [ auth, 

[
    check('text', 'Text is required').not().isEmpty()
]
],
async(req, res) => {
    const user = await User.findById(req.user.id)
    // const {text, comments} = req.body;

    // const name = req.user.name;
    // const avatar = req.user.avatar
    // const newPost = { user, text, name, avatar}

    console.log(user)
})


module.exports = router;

