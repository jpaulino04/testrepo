const   express     = require('express');
const   router      = express.Router();
const   config      = require('config');
const   {check, validationResult } = require('express-validator/check');
const   bcrypt      = require('bcryptjs');
const   jwt         = require('jsonwebtoken');
const   User        = require('../../models/User');
const gravatar = require('gravatar');

router.get('/', (req, res) => {
    res.json({msg: "users route!"})
})

router.post('/', 
[
    check('username', 'username is required').exists(),
    check('email', 'Must be a valid email').isEmail(),
    check('password', 'Password must be at leat 6 characters long').isLength({ min: 6 })
],

async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {username, email, password} = req.body;

    // Get User gravatar
    const avatar = gravatar.url(email, {s: '200', r: 'pg', d: '404'});

    let user = await User.findOne({email})
    if(user){
        return res.json({msg: "User already exists!"})
    }
    
    user = new User({ username, email, password, avatar });

    
    const salt  = await bcrypt.genSalt(10);
    const hash  = await bcrypt.hash(user.password, salt);
    
    user.password = hash;
    await user.save();

    const payload = {
        user: {
            id: user.id
        }
    }

    //sign using your secret
    jwt.sign(payload, config.get('mySecret'), { expiresIn: 360000 }, function(err, token) {
        console.log("User has been created");
        res.json({token})
    });
})


module.exports = router;