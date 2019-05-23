const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User  = require('../models/User');
const config = require('config');


module.exports = (req, res, next) => {

        const token =  req.header('x-auth-token');

        //Check if no token
        if(!token){
            return res.status(401).json({msg: 'No token, Auth denied'})
        }
        
        //verify token
        try{

            const decoded = jwt.verify(token, config.get('mySecret'));
            req.user = decoded.user;
            next()           

        }catch(err){
            return res.send('Server Err')
        }
        

}