var express = require('express');
const router = express.Router();
const storageController = require('../Controllers/storage'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');


router.post("/blobupload", storageController.blobupload);

router.get("/getModules", storageController.getModules);

router.post("/getFileTypesByModule", storageController.getFileTypesByModule);

router.post("/getFileTypeDetailByFileTypeId", storageController.getFileTypeDetailByFileTypeId);


module.exports = router;