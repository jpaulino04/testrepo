const express   = require('express');
const router    = express.Router();
const {check, validationRequest} = require('express-validator/check');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const auth  = require('../../middlewares/auth');

// GET /api/posts/
// @desc Get all posts
// Private
router.get('/', auth, async(req, res) => {

    try {
        const posts = await Post.find().sort({date:-1});

        res.send(posts)
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server Error')
    }
    

})

//-----------------------------------------------------
// GET /api/posts/:post_id
// @desc Get post by post id
// Private
router.get('/:post_id', auth, async(req, res) => {

    try {
        const post = await Post.findById(req.params.post_id)

        if(!post){
            return res.status(404).send("Post not found")
        }

        return res.json(post)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
    
})

//-----------------------------------------------------
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

//-----------------------------------------------------------
// Delete /api/posts/:post_id
// @desc Delete a post
// Private
router.delete('/:post_id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post){
            return res.status(404).send("Post not found")
        }
        //Note that post.user is the user id embedded in the post
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User not authorized"})
        }

        await post.remove();

        console.log("Post removed")

        return res.json("Post has been removed")
    } catch (err) {
       return res.status(500).send('Server Error') 
    }
})

//-----------------------------------------------------------
// Put /api/posts/likes/:post_id
// @desc Like a post
// Private
router.put('/like/:post_id', auth, async(req, res) => { 

    const post = await Post.findById(req.params.post_id).sort({date: -1})

    console.log(post.likes)
    

})

module.exports = router;

