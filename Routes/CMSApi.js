var express = require('express');
const router = express.Router();
const cmsApiController = require('../Controllers/CMSApiController'); 
const authorize = require('../helpers/authorize');

router.post("/DMEServiceDataStorage", authorize,cmsApiController.DmeServiceDataStore);
router.post("/DMEGeographyDataStorage", authorize,cmsApiController.DmeGeographyDataStore);