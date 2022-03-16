var express = require('express');
const router = express.Router();
const driverMonitoringController = require('../Controllers/driverMonitoring'); 
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');



router.post('/CreateAction', authorize(Role.Admin), driverMonitoringController.CreateAction);

router.post('/CreateActionNotes',  authorize(Role.Admin), driverMonitoringController.CreateActionNotes);

router.post('/UpdateActionResponseType', authorize(Role.Admin), driverMonitoringController.UpdateActionResponseType);

router.post('/UpdateActionStatus', authorize(Role.Admin), driverMonitoringController.UpdateActionStatus);

router.post('/GetActionByEmail', authorize(Role.Admin), driverMonitoringController.GetActionByEmail);

router.post('/GetActionNoteByEmail', authorize(Role.Admin), driverMonitoringController.GetActionNoteByEmail);

router.post('/GetActionCountByStatus', authorize(Role.Admin), driverMonitoringController.GetActionCountByStatus);

router.post('/GetStakeholders', authorize(Role.Admin), driverMonitoringController.GetStakeholders);

router.get('/GetDisposition', authorize(Role.Admin), driverMonitoringController.GetDisposition);


router.get('/GetResponseType', driverMonitoringController.GetResponseType);

module.exports = router;