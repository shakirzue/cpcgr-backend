var express = require('express');
const router = express.Router();
const storageController = require('../Controllers/storage'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');


router.post("/blobupload",  authorize(Role.Admin), storageController.blobupload);

router.get("/getModules", authorize(Role.Admin), storageController.getModules);

router.post("/getFileTypesByModule", authorize(Role.Admin), storageController.getFileTypesByModule);

router.post("/getFileTypeDetailByFileTypeId", authorize(Role.Admin), storageController.getFileTypeDetailByFileTypeId);


module.exports = router;