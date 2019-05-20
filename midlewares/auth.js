const config = require('config');
const jwt = require('jsonwebtoken');

//Export a middleware function
module.exports = function(req, res, next) {

    //Get token from header
    const token = req.header('x-auth-token');

    //Check if no token
    if(!token) {
        return res.status(401).json({ msg: 'No token, auth denied '});
    }

    try{        
        //verify the token
        const decoded = jwt.verify(token, config.get('mySecretToken'))
        
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg: "Token is not valid"})
    }


}