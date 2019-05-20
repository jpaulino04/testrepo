const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

router.post('/', async (req, res) => {
    
    //Ensure you are getting these names in the request
    const {username, email, password} = req.body;

    try {
        
        let user = await User.findOne({email})

        if(user){
            return res.status(401).json([{msg: "User already exists!"}])
        }

        user = new User({
            username, 
            email,
            password
        })


        var salt = await bcrypt.genSaltSync(10);
        user.password = await bcrypt.hashSync(password, salt)

        console.log(user)
        console.log('password hashed')

        user.save();
        //info about the user:
        const payload = {
            user : {
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
        return res.status(500).json({Error: "Server Error!"})
    }
    

})


module.exports = router;