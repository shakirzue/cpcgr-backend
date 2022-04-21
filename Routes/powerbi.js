var express = require('express');
const router = express.Router();
const powerBiController = require('../Controllers/PowerBi'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');


router.post('/getPowerBIReport',  authorize,  powerBiController.getClientIframe);

module.exports = router;
