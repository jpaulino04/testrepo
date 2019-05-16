const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

// /api/users route
router.post('/', [

    //check username
    check('username', 'username required').exists(),
    //check email:
    check('email', 'email required').isEmail(),
    //check password length
    check('password', 'Enter a valid password').isLength({min: 6})

    ], async (req, res) => { 
        const {username, email, password} = req.body;
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }

        try{

            // See if user already exists
            let user = await User.findOne({email});

            if(user){
                return res.status(400).json({errors: {msg: "User Already Exists!"}})
            }


            user = new User({
                username,
                email,
                password
            })

            const salt = await bcrypt.genSalt(10);
            //hash user password:
            user.password = await bcrypt.hash(password, salt)

            user.save();


            //create a payload and sign the jsonwebtoken token
            const payload = {
                user: {
                    id : user.id
                }
            }
            console.log(payload.userid)

            jwt.sign(payload, config.get('mySecretToken'), {expiresIn: 3600}, (err, token) => {
                if(err) throw err;
                res.json({token})
                //You can send back anything, depending on your app
            })    
            
        } catch(err){
            console.log("Server Error "+ err)
            res.status(500).json({error: "Server Error!"})
        }

})


module.exports = router;