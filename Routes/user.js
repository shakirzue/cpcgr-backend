var express = require('express');
const router = express.Router();
const userController = require('../Controllers/user'); 
const authorize = require('../helpers/authorize')

// routes
router.post('/authenticate', userController.authenticate);     // public route

//router.get('/:id', authorize, userController.getById);       // all authenticated users
router.get('/getAllRoles', authorize, userController.getAllRoles);
router.get('/getAllMicroServiceDefinitions', authorize, userController.getAllMicroServiceDefinitions); 
router.get('/getAllPermissionLevel', authorize, userController.getAllPermissionLevel); 
router.post('/getAllUser', authorize, userController.getAllUserByTanent); // admin only
router.post('/getUserPermissionByObjectId', authorize, userController.getUserPermissionByObjectId); 
router.post('/saveUserPermission', authorize, userController.saveUserPermission); 
module.exports = router;

