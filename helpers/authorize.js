const jwt = require('jsonwebtoken');
//const expressJwt = require('express-jwt');
const jwt_decode = require('jwt-decode');
const { secret } = require('../config.json');


const authorize = (req, res, next) => {
  
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    var decodedHeader = jwt_decode(token);
    if (req.headers.oid === decodedHeader.oid) {
        next();
    }
    else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
module.exports = authorize;