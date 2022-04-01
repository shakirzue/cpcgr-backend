const config = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
var sql = require("mssql");

// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
];

module.exports = {
    authenticate,
    getAll,
    getById,
    getAllUserRoles
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    console.log(user);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    // return users.map(u => {
    //     const { password, ...userWithoutPassword } = u;
    return users;
    // });
}

async function getById(objectId) {
    if (typeof objectId !== 'undefined') {

        sql.connect(config, function (err) {
            if (err) console.log(err);
            // create Request object
            request = new sql.Request();

            request.input('objectId', sql.UniqueIdentifier, objectId);

            request.query('select * from [dbo].[User_Profile] where objectId = @objectId', (err, result) => {
                if (err) console.log(err);
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    return res.json({ success: true, message: "record found", result: result.recordset });
                }
                else {
                    return res.status(401).json({ success: false, message: "record not found" });
                }
            });


        });
    }
    else {
        return res.status(400).json({ isAuth: false, message: "Credential(s) have not been provided" });
    }
    // const user = users.find(u => u.id === parseInt(id));
    // if (!user) return;
    // const { password, ...userWithoutPassword } = user;
    // return userWithoutPassword;
}

async function getAllUserRoles(){
 // connect to your database

 sql.connect(config, function (err) {
    if (err) console.log(err);
    // create Request object
    request = new sql.Request();

    // query to the database and get the records

    request.query('select * from dbo.User_Type', function (err, result) {

        if (err) console.log(err)

        // send records as a response

        if (result.recordset.length > 0) {
            return res.json({ success: true, message: "record fetched successfully.", result: result.recordset });
        }
        else {
            return res.status(400).json({ isAuth: false, message: "unable to fetch record" });
        }
    });
});


}