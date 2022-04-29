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
    getAllClient,
    SaveUserPermission,
    CreateClient,
    CreateUserProfile,
    getDefaultUserClient,
    getUserClients,
    getClientById,
    AssociateUserAndClient
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

async function getAllUserRoles() {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request
                    .query('select * from dbo.User_Type')
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

async function getAllPermissionLevel() {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request
                    .query('select * from dbo.Permission_Level')
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

async function getAllMicroServiceDefinitions() {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request
                    .query('select * from dbo.Micro_Service_Definition')
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

async function getAll(tenantId) {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "SELECT * FROM [dbo].[User_Profile] WHERE [TenantId] = @tenantId"
                let result = request
                    .input('tenantId', sql.UniqueIdentifier, tenantId)
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

async function getById(objectId) {

    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "select * from [dbo].[User_Profile] where objectId = @objectId"
                let result = request
                    .input('objectId', sql.UniqueIdentifier, objectId)
                    .query(query)
                    .then((result) => {
                        if (err) console.log(err);
                        if (typeof result !== "undefined" && result.recordset.length > 0) {
                            resolve({ success: true, message: "record found", result: result.recordset });
                        }
                        else {
                            resolve({ success: false, message: "record not found" });
                        }
                    })
                    .then(() => conn.close())
            })
    });
}

async function getAllClient() {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request
                    .query('select * from dbo.Client_Details')
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

async function getAllClient(objectId, clientId) {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request
                    .input('objectId', sql.UniqueIdentifier, objectId)
                    .input('clientId', sql.Int, clientId)
                    .execute("usp_get_all_clients")
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

async function getDefaultUserClient(objectId) {

    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "SELECT Top 1 cd.* from dbo.Client_Details cd inner join "+
                "dbo.Client_User_Link cul on cd.ClientId = cul.ClientId inner join "+
                "dbo.User_Profile up on cul.UserProfileId = up.Id "+
                "WHERE up.ObjectId = @objectId AND cul.IsDefaultClient = 1";
                let result = request
                    .input('objectId', sql.UniqueIdentifier, objectId)
                    .query(query)
                    .then((result) => {                    
                        if (typeof result !== "undefined" && result.recordset.length > 0) {
                            resolve({ success: true, message: "record found", result: result.recordset });
                        }
                        else {
                            resolve({ success: false, message: "record not found" });
                        }
                    })
                    //.then(() => conn.close())
            })
    });
}

async function getUserClients(objectId) {

    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "SELECT cd.*,cul.IsDefaultClient from dbo.Client_Details cd inner join "+
                "dbo.Client_User_Link cul on cd.ClientId = cul.ClientId inner join "+
                "dbo.User_Profile up on cul.UserProfileId = up.Id "+
                "WHERE up.ObjectId = @objectId"
                let result = request
                    .input('objectId', sql.UniqueIdentifier, objectId)
                    .query(query)
                    .then((result) => {
                        if (typeof result !== "undefined" && result.recordset.length > 0) {
                            resolve({ success: true, message: "record found", result: result.recordset });
                        }
                        else {
                            resolve({ success: false, message: "record not found" });
                        }
                    })
                   // .then(() => conn.close())
            })
    });
}

async function getClientById(id) {

    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "select * from [dbo].[Client_Details] where id = @id"
                let result = request                    
                    .input('id', sql.Int, id)
                    .query(query)
                    .then((result) => {
                        if (err) console.log(err);
                        if (typeof result !== "undefined" && result.recordset.length > 0) {
                            resolve({ success: true, message: "record found", result: result.recordset });
                        }
                        else {
                            resolve({ success: false, message: "record not found" });
                        }
                    })
                    .then(() => conn.close())
            })
    });
}

async function getPermissionDetailsByUserId(objectId, clientId) {
    return new Promise(function (resolve, reject) {        
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "SELECT [user].Id, [user].[Name],[user].ParentCompany, up.MicroServiceId, up.PermissionLevelId, " +
                    "msd.[Description] as ModuleDiscription, pl.[Description] as PermissionDescription  "+
                    "from dbo.User_Permission up inner join " +
                    "dbo.User_Profile [user] on up.UserProfileId = [user].Id inner join " +
                    "dbo.Micro_Service_Definition msd on up.MicroServiceId = msd.Module_Id inner join " +
                    "dbo.Permission_Level pl on up.PermissionLevelId = pl.Id inner join " +
                    "dbo.Client_Details cd on up.ClientId = cd.ClientId "+
                    "WHERE [user].objectId = @objectId AND cd.ClientId = @clientId"
                let result = request
                    .input('objectId', sql.UniqueIdentifier, objectId)
                    .input('clientId', sql.Int, clientId)
                    .query(query)
                    .then((result) => {
                        if (result.recordset.length > 0) {
                            resolve(({ success: true, message: "record fetched successfully.", result: result.recordset }));
                        }
                        else {
                            resolve(({ success: false, message: "unable to fetch record" }));
                        }
                    })
                    //.then(() => conn.close())
            })
    });
}

async function CreateClient(clientObject) {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request
                    .input('CompanyName', sql.NVarChar, clientObject.CompanyName)
                    .input('Address1', sql.NVarChar, clientObject.Address1)
                    .input('Address2', sql.NVarChar, clientObject.Address2)
                    .input('ContactNumber', sql.NVarChar, clientObject.ContactNumber)
                    .input('ZipCode', sql.NVarChar, clientObject.ZipCode)
                    .input('ContactPerson', sql.NVarChar, clientObject.ContactPerson)
                    .query("INSERT INTO [dbo].[Client_Details]([CompanyName],[Address1],[Address2],[ContactNumber],[ZipCode],[ContactPerson])" +
                        "VALUES(@CompanyName, @Address1, @Address2, @ContactNumber, @ZipCode, @ContactPerson); SELECT SCOPE_IDENTITY() As NewId;")
                    .then((result) => {
                        console.log(result);
                        resolve(result);
                    }).catch(err => {
                        console.log('error: ',err);
                        resolve(({ success: false, message: err}));
                      });
            })
    });
}

async function CreateUserProfile(userProfileObject) {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request              
                    .input('Name', sql.NVarChar, userProfileObject.name)
                    .input('ObjectId', sql.UniqueIdentifier, userProfileObject.objectId)
                    .input('tenantId', sql.UniqueIdentifier, userProfileObject.tenantId)
                    .input('Phone', sql.NVarChar, userProfileObject.phone)
                    .input('ParentCompany', sql.NVarChar, userProfileObject.parentCompany)
                    .input('ClientId', sql.Int, userProfileObject.clientId)
                    .input('IsDefaultClient', sql.Bit, userProfileObject.isDefaultClient)
                    .output('new_id', sql.Int)
                    .execute("usp_create_user_profile")
                    .then((result) => {
                        console.log(result) // count of recordsets returned by the procedure           
                        console.log(result.output) // key/value collection of output values 
                        resolve(result.output.new_id);
                    }).catch(err => {
                        console.log('error: ',err);
                        resolve(({ success: false, message: err}));
                      });
            })
    });
}

async function SaveUserPermission(permissionObject) {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request
                    .input('assignee_profile_id', sql.Int, permissionObject.assigneeProfileId)
                    .input('permission_level_id', sql.Int, permissionObject.permissionLevelId)
                    .input('objectId', sql.UniqueIdentifier, permissionObject.objectId)
                    .input('micro_service_id', sql.Int, permissionObject.microServiceId)
                    .input('client_id', sql.Int, permissionObject.clientId)
                    .input('company_name', sql.NVarChar, permissionObject.companyName)
                    .output('new_id', sql.Int)
                    .execute("usp_assign_user_permission")
                    .then((result) => {
                        console.log(result) // count of recordsets returned by the procedure           
                        console.log(result.output) // key/value collection of output values 
                        resolve(result.output.new_id);
                    }).catch(err => {
                        console.log('error: ',err);
                        resolve(({ success: false, message: err}));
                      });
            })
    });
}

async function AssociateUserAndClient(userProfileObject) {
    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let result = request                 
                    .input('UserProfileId', sql.Int, userProfileObject.userProfileId)
                    .input('ClientId', sql.Int, userProfileObject.clientId)
                    .input('IsDefaultClient', sql.Bit, userProfileObject.isDefaultClient)
                    .query("INSERT INTO [dbo].[Client_User_Link] (ClientId, UserProfileId, IsDefaultClient) VALUES (@ClientId, @UserProfileId, @IsDefaultClient); SELECT SCOPE_IDENTITY() AS [NewId];")
                    .then ((result) => {                       
                        console.log(result) // count of recordsets returned by the procedure           
                        resolve(({ success: true, message: "record saved successfully.", result: result.recordset[0].NewId }));
                    }).catch(err => {
                        console.log('error: ',err);
                        resolve(({ success: false, message: err}));
                      });
            })
    });
}