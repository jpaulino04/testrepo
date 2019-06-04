const express   = require('express');
const router    = express.Router();
const config    = require('config');
const {check, validationResult} = require('express-validator/check');
const Profile   = require('../../models/Profile');
const User      = require('../../models/User');
const request   = require('request');
const auth      = require('../../middlewares/auth');


// GET api/profile/me
// @desc Get all profiles
// Public
router.get('/me', auth, async (req, res) => {
    try {
        console.log(req.user)
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])

        if(!profile){
            return res.status(400).json({ msg: "There is no profile for this user"});
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Serve Error')
    }
})

// GET api/profile/
// @desc Create/ Update profile
// Private

router.post('/', [auth, 
[
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
],

async(req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({Errors: errors.array()});
    }

    const {company, website, location, bio, githubusername, instagram, facebook, youtube, status, skills, linkedin, twitter} = req.body;

    //Build profile object
    const profileInfo = {};
    profileInfo.user = req.user.id;
    if(company) profileInfo.company = company;
    if(website) profileInfo.website = website;
    if(location) profileInfo.location = location;
    if(bio) profileInfo.bio = bio;
    if(status) profileInfo.status = status;
    if(githubusername) profileInfo.githubusername = githubusername;
    if(skills){
        profileInfo.skills = skills.split(',').map(skill => skill.trim()); //**************** */
    }

    // Build social object
    profileInfo.social = {};
    if(youtube) profileInfo.social.youtube = youtube;
    if(twitter) profileInfo.social.twitter = twitter;
    if(facebook) profileInfo.social.facebook = facebook;
    if(linkedin) profileInfo.social.linkedin = linkedin;
    if(instagram) profileInfo.social.instagram = instagram;

    
    try {
        let profile = await Profile.findOne({user: req.user.id});

        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileInfo}, {new: true});

            res.json({msg:"Profile Updated", profile});
        }

        //Create
        profile = new Profile(profileInfo);
        await profile.save()
        res.json(profile);

    } catch (err) {
        return res.status(500).json({msg: "Server Error!"});        
    }
}

])

// GET api/profile
// @desc Get all profiles
// Public
router.get('/', async(req, res) => {
    
    try {
        let profiles = await Profile.find().populate('user', ['avatar', 'username', 'email']);
        res.json(profiles)
    } catch (err) {
        if(err){
            res.status(500).json({msg: "Server Error"})
        }
    }
})

// GET api/profile/user/:user_id
// @desc Get profile by id
// Private
router.get('/user/:user_id/', auth, async(req, res) => {

    try {
        let profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['avatar', 'email']);

        if(!profile){
            return res.status(404).json({msg: "Profile not found!"})
        }
        res.json(profile)
        
    } catch (err) {
        return res.json({msg: "Server Error"});
    }
})

// DELETE api/profile/
// @desc Delete Profile, user & posts
// Private
router.delete('/', auth, async(req, res) => {    
    try {

        //Remove user's posts...pending

        //Remove profile
        await Profile.findOneAndRemove({user:req.user.id});

        //Remove User (By user id)
        await User.findOneAndRemove({_id:req.user.id});

        res.json({msg: "User and profile removed! "})

    } catch (err) {
        return res.status(500).send("Server Error")
    }
})

// Add api/profile/experience
// @desc Update Profile Experience
// Private

router.put('/experience', [auth,

    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From is required').not().isEmpty()        
    ],
],
async (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({msg: errors.array()})
    }

    const {title, company, location, from, description} = req.body;
    const updateExperience = {title, company, from, description}
    
    try {

        let profile = await Profile.findOne({user:req.user.id})
        let experience = profile.experience;

        
        experience.unshift(updateExperience)
        await profile.save()
        res.json(profile)
        
    } catch (err) {
        return res.status(500).send('Server error!')
    }    
})

// DELETE api/profile/experience
// @desc DELETE Profile Experience
// Private
router.delete('/experience/:exp_id', auth, async(req, res) => {

    try {
        const profile = await Profile.findOne({user:req.user.id})
        const experience = profile.experience;
        const expId = req.params.exp_id;

        //Get the index to remove
        let deleteIndex = experience.findIndex(item => item._id = expId);

        ///You can also do:
        //experience.map(item => item.id).indexOf(req.params.exp_id)

        experience.splice(deleteIndex, 1)

        await profile.save();
        res.json({msg: "Experience deleted", experience})
    } catch (err) {
        return res.status(500).send("Serve error! ")
    }
    
})

// Add api/profile/education
// @desc Add Profile Education
// Private
router.put('/education', [auth,
[
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
],
],

async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({msg: errors.array()})
    }


})

module.exports = router;