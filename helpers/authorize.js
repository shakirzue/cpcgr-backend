const jwt = require('jsonwebtoken');
//const expressJwt = require('express-jwt');
const jwt_decode = require('jwt-decode');
const { secret } = require('../config.json');


const authorize = (req, res, next) => {
    console.log(req);

    const authHeader = req.headers.authorization;

    const token = authHeader.split(' ')[1];
    console.log(token);
    

    //const token = req.header.authorize;
    //const decoded = jwt_decode(secret);

    var decodedHeader = jwt_decode(token);
    console.log(decodedHeader);
    next();

   // console.log(decoded);
    
    
    
};
module.exports = authorize;