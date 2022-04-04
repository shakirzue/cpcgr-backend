const config = require('../config/config');
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
    getAllUserRoles,
    getPermissionDetailsByUserId,
    getAllPermissionLevel,
    getAllMicroServiceDefinitions,
    SaveUserPermission
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

async function getAllUserRoles() {
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

async function getAllPermissionLevel() {
    // connect to your database

    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records

        request.query('select * from dbo.Permission_Level', function (err, result) {

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

async function getAllMicroServiceDefinitions() {
    // connect to your database

    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records

        request.query('select * from dbo.Micro_Service_Definition', function (err, result) {

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

async function getPermissionDetailsByUserId(objectId) {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "SELECT [user].Id, [user].[Name], [user].RoleId, up.MicroServiceId, up.PermissionLeveId, " +
                    "ut.User_Type as [Role] , msd.[Description] as ModuleDiscription, pl.[Description] as PermissionDescription  from dbo.User_Permission up inner join " +
                    "dbo.User_Profile [user] on up.UserProfileId = [user].Id inner join " +
                    "dbo.Micro_Service_Definition msd on up.MicroServiceId = msd.Module_Id inner join " +
                    "dbo.Permission_Level pl on up.PermissionLeveId = pl.Id inner join " +
                    "dbo.User_Type ut on [user].RoleId = ut.Id where [user].objectId = @objectId"

                let result = request
                    .input('objectId', sql.UniqueIdentifier, objectId)
                    .query(query)
                    .then((result) => {

                        if (result.recordset.length > 0) {
                            resolve(({ success: true, message: "record fetched successfully.", result: result.recordset }));
                        }
                        else {
                            resolve(({ success: false, message: "unable to fetch record" }));
                        }
                    })
                    .then(() => conn.close())
            })
    });
}

async function SaveUserPermission(permissionObject) {
    sql.connect(config)
        .then((conn) => {
            const request = conn.request();

            let result = request
                .input('assignee_profile_id', sql.Int, permissionObject.assigneeProfileId)
                .input('permission_level_id', sql.Int, permissionObject.permissionLevelId)
                .input('objectId', sql.UniqueIdentifier, permissionObject.objectId)
                .input('micro_service_id', sql.Int, permissionObject.microServiceId)
                .output('new_id', sql.Int)
                .execute("usp_assign_user_permission")
                .then((result) => {
                    console.log(result) // count of recordsets returned by the procedure           
                    console.log(result.output) // key/value collection of output values          
                })
            // .then(() => conn.close())
        })
}