var express = require('express');
const router = express.Router();
const userController = require('../Controllers/user');
const authorize = require('../helpers/authorize')

// routes
router.post('/authenticate', userController.authenticate);
router.get('/getAllRoles', authorize, userController.getAllRoles);
router.get('/getAllClient', authorize, userController.getAllClient);
router.post('/getAllPermissionLevel', authorize, userController.getAllPermissionLevel);
router.get('/getAllMicroServiceDefinitions', authorize, userController.getAllMicroServiceDefinitions);
router.post('/getAllUser', authorize, userController.getAllUserByTanent);
router.post('/getById', authorize, userController.getById);
router.post('/getUserPermissionByObjectId', authorize, userController.getUserPermissionByObjectId);
router.post('/getDefaultClient', authorize, userController.getDefaultClient);
router.post('/getAllUserClients', authorize, userController.getAllUserClients);
router.post('/getClientById', authorize, userController.getClientById);
router.post('/createClient', authorize, userController.createClient);
router.post('/createUserProfile', authorize, userController.createUserProfile);
router.post('/saveUserPermission', authorize, userController.saveUserPermission);
router.post('/associateUserAndClient', authorize, userController.associateUserAndClient);
module.exports = router;

