const userService = require('../Services/user');
const Role = require('../helpers/role');

const authenticate = (req, res, next) => {

    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

const getAllRoles = (req, res, next) => {
    userService.getAllUserRoles()
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getAllClient = (req, res, next) => {
    userService.getAllClient()
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getAllPermissionLevel = (req, res, next) => {
    userService.getAllPermissionLevel(req.body.objectId)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getAllMicroServiceDefinitions = (req, res, next) => {
    userService.getAllMicroServiceDefinitions()
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getAllUserByTanent = (req, res, next) => {
    userService.getAll(req.body.tenantId)
        .then(users => res.json(users))
        .catch(err => next(err));
}

const getById = (req, res, next) => {

    userService.getById(req.body.objectId)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

const getDefaultClient = (req, res, next) => {
    userService.getDefaultUserClient(req.body.objectId)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getAllUserClients = (req, res, next) => {
    userService.getUserClients(req.body.objectId)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getClientById = (req, res, next) => {
    userService.getClientById(req.body.clientId)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const getUserPermissionByObjectId = (req, res, next) => {  
    userService.getPermissionDetailsByUserId(req.body.objectId, req.body.clientId)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to fetch record" }))
        .catch(err => next(err));
}

const createClient = (req, res, next) => {
    userService.CreateClient({CompanyName: req.body.companyName, Address1: req.body.address1, Address2: req.body.address2,ContactNumber: req.body.contactNumber, ZipCode: req.body.zipCode, ContactPerson: req.body.contactPerson})
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to save record" }))
        .catch(err => next(err));
}

const createUserProfile = (req, res, next) => {
    userService.CreateUserProfile({ name: req.body.name, objectId: req.body.objectId,tenantId: req.body.tenantId, phone: req.body.phone, clientId: req.body.clientId, isDefaultClient: req.body.isDefaultClient})
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to save record" }))
        .catch(err => next(err));
}

const saveUserPermission = (req, res, next) => {
    userService.SaveUserPermission({objectId: req.body.objectId,assigneeProfileId: req.body.assigneeProfileId, permissionLevelId: req.body.permissionLevelId,microServiceId: req.body.microServiceId, clientId: req.body.clientId, companyName: req.body.CompanyName})
        .then(user => user ? res.json(user) : res.json({ success: false, message: "unable to save record" }))
        .catch(err => next(err));
}

const associateUserAndClient = (req, res, next) => {
    userService.AssociateUserAndClient({userProfileId: req.body.userProfileId,clientId: req.body.clientId, isDefaultClient: req.body.isDefaultClient})
        .then((user) => { console.log(user); user ? res.json(user) : res.sendStatus(404).json({ success: false, message: "unable to save record" })})
        .catch(err => next(err));
}

module.exports = {
    authenticate,
    getAllUserByTanent,
    getById,   
    getAllRoles,
    getUserPermissionByObjectId,    
    getAllMicroServiceDefinitions,
    getAllPermissionLevel,
    getAllClient,
    getDefaultClient,
    getAllUserClients,
    getClientById,
    createUserProfile,
    createClient,
    saveUserPermission,
    associateUserAndClient
};