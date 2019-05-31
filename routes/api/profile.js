const express   = require('express');
const router    = express.Router();
const config    = require('config');
const {check, validationResult} = require('express-validator/check');
const Profile   = require('../../models/Profile');
const request   = require('request');
const auth      = require('../../middlewares/auth');


// GET api/profile/
// @desc Get all profiles
// Public
router.get('/', async (req, res) => {

    try {
        const profile = await Profile.find().populate('user', ['avatar', 'username', 'email'])

        if(!profile){
            return res.status(404).json({msg: 'Profile not found'})
        }
        res.json(profile)        
    } catch (err) {
        console.error(err.message)
        res.json({msg: 'Server Error'})
    }
})

// GET api/profile/me
// @desc Get your own profiles
// Private

router.get('/me', auth, async(req, res) => {

    try {
        const profile = await Profile.findOne({user:req.user}).populate('user', ['username', 'email', 'avatar'])

        if(!profile){
            return res.status(404).json({msg:" Profile not found"})
        }

        res.json(profile);
    } catch (err) {
        return res.status(500).send('Server Error')
    }

})

// POST api/profile/
// @desc Create profile
// Private
router.post('/', auth,
[
    check('skills', 'Skills is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty(),
],

async(req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.json({Errors:errors.array()})
    }

    const {company, website, location, bio, githubusername, instagram, twitter, facebook, youtube, status, skills} = req.body;

    const profileInfo = {company, website, location, bio, githubusername, instagram, twitter, facebook, youtube, status, skills}

    // try {
        console.log(req.user)
        const profile = await Profile.findOneAndUpdate({user: req.user}, {$set: profileInfo}, {new: true})

        await profile.save()

        res.json(profile);
        
    // } catch (err) {
    //     if(err){
    //         res.status(500).send('Server Error');
    //     }
    // }

})

module.exports = router;