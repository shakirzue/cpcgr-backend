const userService = require('../Services/user');
const Role = require('../helpers/role');

const authenticate = (req, res, next) => {

    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

const getAll = (req, res, next) => {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

const getById = (req, res, next) => {

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

const getAllRoles = (req, res, next) => {

    userService.getAllUserRoles()
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

const getUserPermissionByObjectId = (req, res, next) => {

    userService.getPermissionDetailsByUserId(req.body.objectId)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

const getUserPermission = (req, res, next) => {

    userService.SaveUserPermission({req.body.objectId, req.body.assigneeProfileId, req.body.permissionLevelId, req.body.microServiceId})
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

module.exports = {
    authenticate,
    getAll,
    getById,   
    getAllRoles,
    getUserPermissionByObjectId
};