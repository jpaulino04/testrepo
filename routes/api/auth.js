const       express = require('express');
const       router  = express.Router();
const       auth    = require('../../middlewares/auth');  
const {check, validationResult} = require('express-validator/check');
const       User = require('../../models/User');
const       bcrypt = require('bcryptjs');
const       jwt = require('jsonwebtoken');
const       config = require('config');

router.get('/', auth, (req, res) => {

    res.json({msg: 'Congrats!'})

})

router.post('/', 
[
    check('email').isEmail(),
    check('password').exists()
], 
async (req, res) => { 
    //Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    let user = await User.findOne({email})

    if(!user){
        return res.json({Error: "User does not exist"})
    }

    //Check if password entered is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.json({Msg: "Invalid login!"})
    }

    const payload = {
        user: {
            id: user.id
        }
    }
    
    jwt.sign(payload, config.get('mySecret'), function(err, token){
        if(err) throw 'jwt error: ', err;
        res.json({token})
    })
})



module.exports = router;
