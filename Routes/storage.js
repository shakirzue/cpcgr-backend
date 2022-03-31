var express = require('express');
const router = express.Router();
const storageController = require('../Controllers/storage'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');


router.post("/blobupload",  authorize, storageController.blobupload);

router.get("/getModules", authorize, storageController.getModules);

router.post("/getFileTypesByModule", authorize, storageController.getFileTypesByModule);

router.post("/getFileTypeDetailByFileTypeId", authorize, storageController.getFileTypeDetailByFileTypeId);


module.exports = router;