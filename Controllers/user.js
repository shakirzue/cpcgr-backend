const userService = require('../Services/user');
const Role = require('../helpers/role');

const authenticate = (req, res, next) => {

    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

const getAllUserByTanent = (req, res, next) => {
    userService.getAll(req.body.tenantId)
        .then(users => res.json(users))
        .catch(err => next(err));
}

const getById = (req, res, next) => {

    userService.getById('')
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

const getAllRoles = (req, res, next) => {
    userService.getAllUserRoles()
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getAllMicroServiceDefinitions = (req, res, next) => {
    userService.getAllMicroServiceDefinitions()
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getAllPermissionLevel = (req, res, next) => {
    userService.getAllPermissionLevel(req.body.objectId)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getUserPermissionByObjectId = (req, res, next) => {  
    userService.getPermissionDetailsByUserId(req.body.objectId)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const saveUserPermission = (req, res, next) => {
    userService.SaveUserPermission({objectId: req.body.objectId,assigneeProfileId: req.body.assigneeProfileId, permissionLevelId: req.body.permissionLevelId,microServiceId: req.body.microServiceId})
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to save record" }))
        .catch(err => next(err));
}

module.exports = {
    authenticate,
    getAllUserByTanent,
    getById,   
    getAllRoles,
    getUserPermissionByObjectId,
    saveUserPermission,
    getAllMicroServiceDefinitions,
    getAllPermissionLevel
};