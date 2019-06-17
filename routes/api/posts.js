const express   = require('express');
const router    = express.Router();
const {check, validationResult} = require('express-validator/check');
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
// Put /api/posts/like/:post_id
// @desc Like a post
// Private
router.put('/like/:post_id', auth, async(req, res) => { 
    //Note : a like will have its own id
    // So the post will have a like_id and a user_id

    try {
        const post = await Post.findById(req.params.post_id);

        if(post.likes.filter(like => like.user.toString() == req.user.id).length > 0){
            return res.status(400).json({msg: "Post already liked"})
        }
        post.likes.unshift({user: req.user.id})

        await post.save();

        return res.json(post.likes)
    } catch (err) {
        console.error(err)
        res.status(500).send("Server Error");
    }
})

//-----------------------------------------------------------
// Put /api/posts/unlike/:post_id
// @desc Unlike a post (that had already been liked)
// Private
router.put('/unlike/:post_id', auth, async(req, res) => {

    try {
        const post = await Post.findById(req.params.post_id);

        if(post.likes.filter(like => like.user.toString() == req.user.id).length === 0){
            return res.status(400).json({msg: 'Post has not yet been liked'})
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes)
        
    } catch (err) {
        return res.status(500).send('Server error')
    }
})


//-----------------------------------------------------------
// Put /api/posts/:post_id/comments
// @desc Add a Post comment
// Private

router.put('/:post_id/comments', [auth,
],
[
    check('text', 'Text is required').not().isEmpty()
],
async (req, res) =>{

    let errors = validationResult(req);

    if(!errors.isEmpty()){
        console.error(errors.message)
        res.status(500).json({msg: errors.array});
    }

    try {
        const post = await Post.findById(req.params.post_id);
        const user = await User.findById(req.user.id);

        const newComment = {
            user: user.id,
            text: req.body.text,
            avatar: user.avatar,
            name: user.username
        }
        
        post.comments.unshift(newComment)

        await post.save();

        return res.json(post)

    } catch (err) {
        return res.status(500).send("Server Error")
    }

})

module.exports = router;

