var express = require('express');
const router = express.Router();
const wipsamController = require('../Controllers/wipsam'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');


router.get('/getWipsam',  authorize(Role.Admin),  wipsamController.getWipsam);

module.exports = router;
