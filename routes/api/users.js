const mongoose  = require('mongoose');
const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const { check, validationResult }   = require('express-validator/check');
const User      = require('../../models/User');


router.get('/', (req, res) => {
    res.send('users route!')
})

router.post('/',
[
    check('email').isEmail(),
    check('name').exists(),
    check('password').isLength({ min: 6})
], 
async (req, res) =>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    const { name, email,  password} = req.body;

    try{
        let user = await User.findOne({email})

        if(user){
            return res.send('User Already exists!') 
        }

        user = new User({
            name,
            email,
            password
        })
        
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt)        
        user.password = hash;        
        user.save()

        const payload = {
            user: {
                id: user.id
            }
        }
        
        //Create and return token
        jwt.sign(payload, config.get('mySecret'), function(err, token){
            if(err){
                return res.send('jwt Error')
            }
            return res.json({token})
        })



    } catch (err){
        return res.send('Server Error!')
    }    

})

module.exports = router;