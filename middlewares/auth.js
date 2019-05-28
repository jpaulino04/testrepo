const jwt       = require('jsonwebtoken');
const User      = require('../models/User');
const config    = require('config');
module.exports = async (req, res, next) => {

    const token = req.header('x-auth-token');

    if(!token){
        return res.json({Error: 'Unable to validate user!'})
    }

    try{

        jwt.verify(token, config.get('mySecret'), function(err){
            if(err) throw err;
            next();
        })

    }catch(err){
        res.json({Error: "Unable to validate login"})
    }
    

}