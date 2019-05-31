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


module.exports = router;