var express = require('express');
const router = express.Router();
const userController = require('../Controllers/user'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');

// routes
router.post('/authenticate', userController.authenticate);     // public route
router.get('/', authorize, userController.getAll); // admin only
router.get('/:id', authorize, userController.getById);       // all authenticated users
router.get('/getAllRoles', authorize, userController.getAllRoles); 

module.exports = router;

