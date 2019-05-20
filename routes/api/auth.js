const express = require('express');
const router = express.Router();
const auth = require('../../midlewares/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator/check');

// api/auth route
router.post('/', 
[
    check('email', 'Please include a valid Email').isEmail(),
    check('password', 'Password is required').exists()
],

async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body;

    try{

        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({errors: [{msg: "Invalid User Credentials"}]})
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
       
        if(!isMatch){
            return res.status(401).json({errors: [{msg: "Invalid User Credentials"}]})
        }
        
        const payload = {
            user: {
                id: user.id
            }
        }       

        //sign and send token
        jwt.sign(payload, config.get('mySecretToken') ,function(err, token){
            if(err){
                console.log(err)
                return res.json({err})
            }
            console.log("Token sent!")
            res.json({token})

        })

    } catch(err){
        return res.status(401).json([{msg: "Server Error" }])
    }

})


module.exports = router;