var express = require('express');
const router = express.Router();
const wipsamController = require('../Controllers/wipsam'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');


router.post('/getPowerBIReport',  authorize(Role.Admin),  wipsamController.getWipsam);

module.exports = router;
