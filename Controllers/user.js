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

const logout = (req, res) => {
    // clear the cookie
    res.clearCookie("auth");
    res.clearCookie("email");
    // redirect to login
    return res.send("logout successfully");
};


module.exports = {
    authenticate,
    getAll,
    getById,
    logout, getAllRoles
};