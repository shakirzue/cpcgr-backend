var express = require('express');
const router = express.Router();
const driverMonitoringController = require('../Controllers/driverMonitoring'); 
const authorize = require('../helpers/authorize');
const Role = require('../helpers/role');



router.post('/CreateAction', authorize, driverMonitoringController.CreateAction);

router.post('/CreateActionNotes',  authorize, driverMonitoringController.CreateActionNotes);

router.post('/UpdateActionResponseType', authorize, driverMonitoringController.UpdateActionResponseType);

router.post('/UpdateActionStatus', authorize, driverMonitoringController.UpdateActionStatus);

router.post('/GetActionByEmail', authorize, driverMonitoringController.GetActionByEmail);

router.post('/GetActionNoteByEmail', authorize, driverMonitoringController.GetActionNoteByEmail);

router.post('/GetActionCountByStatus', authorize, driverMonitoringController.GetActionCountByStatus);

router.post('/GetStakeholders', authorize, driverMonitoringController.GetStakeholders);

router.get('/GetDisposition', authorize, driverMonitoringController.GetDisposition);


router.get('/GetResponseType', authorize, driverMonitoringController.GetResponseType);

router.get('/GetActionStatus', authorize, driverMonitoringController.GetActionStatus);


router.get('/GetRole', authorize, driverMonitoringController.GetRole);

router.post('/GetCallLocationLogs', authorize, driverMonitoringController.GetCallLocationLogs);

router.post('/GetTripRoutes', authorize, driverMonitoringController.GetTripRoutes);


router.post("/iframe", driverMonitoringController.iframe);



module.exports = router;