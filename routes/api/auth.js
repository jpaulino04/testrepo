const express   = require('express');
const router    = express.Router();
const auth      = require('../../middlewares/auth');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const User      = require('../../models/User');
const {check, validationResult} = require('express-validator/check');
router.get('/', auth, async (req, res) => {

    const user = await User.findById(req.user.id).select('-password');
    res.json(user)

})

// @route POST api/auth
// @desc Authenticate user & get token
// @access Public

router.post('/',
[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],

async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //Notice the status code below
        return res.status(400).json({errors: errors.array()});
    }
    console.log(req.body)
    const {password, email} = req.body;

    try {
        const user = await User.findOne({email});
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({errors: "Error!"})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 36000}, (err, token) => {
            if(err) throw err;
            res.json({token})
        })


    }catch(err){
        return res.send('Server error')
    }
    



})



module.exports = router;