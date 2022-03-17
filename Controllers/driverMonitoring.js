var express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require('body-parser')
var sql = require("mssql");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require('../config/config');
const smsservice = require('../Services/sms-service');
const drivermonitoringservice = require('../Services/driver-monitoring-service');
const googlemapservice = require('../Services/geocoding-service');



const CreateAction =  (req, res, next) => {
    
    const disposition_id = req.body.disposition_type_id;
    const response_type_id = req.body.response_type_id;
    const assignee = req.body.assignee;
    const note = req.body.note;
    const email = req.body.email;
    const token = req.body.token;

    sql.connect(config, function (err) {
        request = new sql.Request();
        request.input('disposition_type_id', sql.Int, disposition_id)
        request.input('response_type_id', sql.Int, response_type_id)
        request.input('assignee_profile_id', sql.Int, assignee)
        request.input('note', sql.NVarChar, note)
        request.input('email', sql.NVarChar, email)
        request.input('token', sql.NVarChar, token)
        request.output('new_action_notification_id', sql.Int)
        request.execute('usp_create_action_notification', (err, result) => {
            // ... error checks
            var phonenumber = '';
            request.query('Select Phone from [dbo].[adminprofile] WHERE Id = @assignee_profile_id;', (err, result) => {
                if (err) console.log(err);
                console.log(result.recordset);
                if (result.recordset.length > 0) {
                    phonenumber = result.recordset[0].Phone;
                }
                //smsservice.sendSMS('Driver monitoring system: action has been created with note: "' + note + '"', phonenumber);
            });

            console.log(result) // count of recordsets returned by the procedure           
            console.log(result.output) // key/value collection of output values

            return res.json({ success: true, message: "action created successfully and notification sent to stakeholder.", result: 'Action created with id:' + result.output });
        }).catch(err => next(err));
    });
}

const CreateActionNotes = (req, res, next) => {
    console.log(req.body);
    const action_id = req.body.action_id;
    const note = req.body.note;
    const email = req.body.email;
    const token = req.body.token;

    sql.connect(config, function (err) {
        request = new sql.Request();
        request.input('action_id', sql.Int, action_id)
        request.input('notes', sql.NVarChar, note)
        request.input('email', sql.NVarChar, email)
        request.input('token', sql.NVarChar, token)
        request.output('new_action_notification_id', sql.Int)
        request.execute('usp_create_action_notification_notes', (err, result) => {
            // ... error checks
            console.log(result) // count of recordsets returned by the procedure           
            console.log(result.output) // key/value collection of output values           
        })
    });


}


const UpdateActionResponseType = (req, res, next) => {
    console.log(req);
    if (typeof req.body.action_id !== 'undefined' && typeof req.body.action_id !== 'undefined') {
        // connect to your database

        sql.connect(config, function (err) {
            if (err) console.log(err);
            // create Request object
            request = new sql.Request();

            request.input('action_id', sql.Int, req.body.action_id);
            request.input('response_type_id', sql.Int, req.body.response_type_id);
            request.query('Update [dbo].[Action_Notification] SET ResponseType_id = @response_type_id where id = @action_id', (err, result) => {
                if (err) console.log(err);

                return res.json({ success: true, message: "record has been updated successfully.", result: result });
            });


        });
    }
    else {
        return res.status(400).json({ isAuth: false, message: "Credential(s) have not been provided" });
    }
}

const UpdateActionStatus = (req, res, next) => {
    console.log(req.body);
    if (typeof req.body.action_id !== 'undefined' && typeof req.body.action_id !== 'undefined') {
        // connect to your database

        sql.connect(config, function (err) {
            if (err) console.log(err);
            // create Request object
            request = new sql.Request();

            request.input('action_id', sql.Int, req.body.action_id);
            request.input('status_id', sql.Int, req.body.status_id);
            request.query('Update [dbo].[Action_Notification] SET Status_id = @status_id where id = @action_id', (err, result) => {
                if (err) console.log(err);

                return res.json({ success: true, message: "record has been updated successfully.", result: result });
            });


        });
    }
    else {
        return res.status(400).json({ isAuth: false, message: "Credential(s) have not been provided" });
    }
}

const GetActionByEmail = (req, res, next) => {

    const email = req.body.email;
    const token = req.body.token;
    var isassignee;
    if (typeof req.body.isassignee === 'undefined' || req.body.isassignee === null) {
        isassignee = false;
    }
    else {
        isassignee = req.body.isassignee;
    }
    console.log(isassignee);
    sql.connect(config, function (err) {
        request = new sql.Request();
        request.input('email', sql.NVarChar, email)
        request.input('token', sql.NVarChar, token)
        request.input('userisassignee', sql.Bit, isassignee)
        request.execute('usp_get_action_notification_by_email', (err, result) => {
            console.log(result.recordsets[1]);
            console.log(result.recordsets[2]);
            return res.json({ success: true, message: "record found", actions: result.recordset, owner_action_note: result.recordsets[1], assignee_action_note: result.recordsets[2] });;
        })
    });
}

const GetActionNoteByEmail = (req, res, next) => {

    const email = req.body.email;
    const token = req.body.token;
    var isassignee;
    if (typeof req.body.isassignee === 'undefined' || req.body.isassignee === null) {
        isassignee = false;
    }
    else {
        isassignee = req.body.isassignee;
    }
    console.log(isassignee);
    sql.connect(config, function (err) {
        request = new sql.Request();
        request.input('email', sql.NVarChar, email)
        request.input('token', sql.NVarChar, token)
        request.input('userisassignee', sql.Bit, isassignee)
        request.execute('usp_get_action_notification_by_email', (err, result) => {
            console.log(result);
            return res.json({ success: true, message: "record found", actions: result.recordset });;
        })
    });
}

const GetActionCountByStatus = (req, res, next) => {

    const email = req.body.email;
    const token = req.body.token;
    var isassignee;
    if (typeof req.body.isassignee === 'undefined' || req.body.isassignee === null) {
        isassignee = false;
    }
    else {
        isassignee = req.body.isassignee;
    }
    console.log(isassignee);
    sql.connect(config, function (err) {
        request = new sql.Request();
        request.input('email', sql.NVarChar, email)
        request.input('token', sql.NVarChar, token)
        request.input('userisassignee', sql.Bit, isassignee)
        request.execute('usp_get_action_notification_count_by_status', (err, result) => {
            console.log(result);
            return res.json({ success: true, message: "record found", result: result.recordset });;
        })
    });
}

const GetStakeholders = (req, res, next) => {
    const email = req.body.email;
    const token = req.body.token;

    sql.connect(config, function (err) {
        request = new sql.Request();
        request.input('email', sql.NVarChar, email)
        request.input('token', sql.NVarChar, token)
        request.execute('usp_get_stakeholders', (err, result) => {
            return res.json({ success: true, message: "record found", result: result.recordset });;
        })
    });

    

}

const GetDisposition = (req, res, next) => {
    // connect to your database

    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records

        request.query('select * from dbo.Disposition_Type', function (err, result) {

            if (err) console.log(err)

            // send records as a response

            if (result.recordset.length > 0) {
                return res.json({ success: true, message: "user logged in successfully.", result: result.recordset });
            }
            else {
                return res.status(400).json({ isAuth: false, message: "Email/Password has not provided" });
            }
        });
    });

}


const GetResponseType = (req, res, next) => {
    // connect to your database

    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records

        request.query('select * from dbo.Response_Type', function (err, result) {

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


const GetActionStatus = (req, res, next) => {
    // connect to your database

    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records

        request.query('select * from dbo.Action_Status', function (err, result) {

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

const GetRole = (req, res, next) => {
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
                console.log(result.recordset);
                return res.json({ success: true, message: "record fetched successfully.", result: result.recordset });
            }
            else {
                return res.status(400).json({ isAuth: false, message: "unable to fetch record" });
            }
        });
    });

}


const GenerateCallLogAndCoordinate = async (req, res, next) => {

    var Date = req.body.Date;
    const salesOrders = await drivermonitoringservice.GetDriverTripRecords(Date);
    //console.log('salesorders',salesOrders)
    const callLogdata = await drivermonitoringservice.GetDriverCallLogRecords(Date);
    //console.log('call logs',callLogdata)
    var result = drivermonitoringservice.CompareTripDataWithLogData(salesOrders, callLogdata, Date);
    if (result) {
        return res.json({ success: true, message: "log generated successfully.", result: result.recordset });
    }
    else {
        return res.status(400).json({ success: false, message: "unable to generate record" });
    }


}



const GetCallLocationLogs = (req, res, next) => {
    var Date = req.body.SearchDate;

    sql.connect(config, function (err) {
        if (err) console.log(err);
        request = new sql.Request();

        request
            .input('Date', sql.NVarChar, Date)
            .query('select solog.[Id],solog.[SalesOrderNumber],CONVERT(nvarchar(50),solog.[Date]) as Date,solog.[NumberOfCallMade],solog.[IsCustomerPhoneInLog]' +
                ',solog.[CustomerAddressLatitude],solog.[CustomerAddressLongitude],solog.[DifferenceInCoordinates]' +
                ',solog.[DifferenceInLastCallAndSkipTimes], ea.[Exception Type] as ExceptionType, ea.Note ' +
                'from dbo.SalesOrder_Logs_Details as solog inner join dbo.DriverMonitoringExceptionActivityData ea ' +
                'on solog.[SalesOrderNumber] = ea.[Order #] WHERE solog.Date = @Date', function (err, result) {

                    if (err) console.log(err)
                    // console.log(result);
                    if (result.recordset.length > 0) {
                        return res.json({ success: true, message: "record fetched successfully.", result: result.recordset });
                    }
                    else {
                        return res.status(400).json({ success: false, message: "unable to fetch record", result: [] });
                    }
                });
    });

}


const GetTripRoutes = (req, res, next) => {
    var date = req.body.tripdate;
    var tripnumber = req.body.tripnumber;
    var tripactivityroute = [];
    var tripassignedroute = [];
    var querymessage = '';
    
    sql.connect(config, function (err) {
        if (err) console.log(err);
        request = new sql.Request();
        let query = "SELECT [Event Time] as EventTime, [Latitude], [Longitude], [Order #] as OrderNumber FROM [dbo].[DriverMonitoringTripEventActivityData]" +
            "WHERE [Trip #] = @TripNumber and Type='Arrive at Stop'"
        // request.input('Date', sql.NVarChar, date);
        request.input('TripNumber', sql.NVarChar, tripnumber);
        request.query(query, function (err, result) {

            if (err) console.log(err);

            if (result.recordset.length > 0) {
                tripactivityroute = result.recordset;
            }
            else {
                querymessage = "Error in Trip event activity data fetch";
            }

            tripactivityroute.forEach(async element => {
                element["EventTime"] = dateformatehelper.extractTimeFromDate(element.EventTime);
                
            });
           
            let query = "SELECT CAST(Arrival as time) as Arrival, Address FROM [dbo].[DriverMonitoringTripItineraryData]" +
                "WHERE [Trip #] = @TripNumber";

            request.query(query, async (err, result) => {
                let addressProcessed = 0;
                if (err) console.log(err);

                if (result.recordset.length > 0) {
                    tripassignedroute = result.recordset;

                    if (querymessage === "") {
                        querymessage = "records fetched successfully";
                    }
                    tripassignedroute.forEach(async (item, index, array) => {
                        coordinates = await googlemapservice.calculateCustomerAddressGeoCoordinates(item.Address);
                      
                        item['SerialNumber'] = index;
                        item['Latitude'] = coordinates.Latitude;
                        item['Longitude'] = coordinates.Longitude;                       
                        addressProcessed++;
                        if (addressProcessed === (array.length - 1)) {                           
                            return res.json({ success: true, message: querymessage, tripcoordinates: tripassignedroute, activitycoordinates: tripactivityroute });
                        }
                    });

                }
                else {
                    querymessage = "Error in fetching Sales order log data";
                    return res.status(400).json({ success: false, message: querymessage });
                }
            });
        });
    });

}

const iframe = (req, res, next) => {
    var src = 'https://app.powerbi.com/view?r=eyJrIjoiMGVmMzc0ZDItNzdiYS00NDdmLThhZjktZTY2ZmQ3NzgxOTY5IiwidCI6IjdkODViMzVjLTg3MmUtNDA1NS1hZjkyLTgwZmI3YzlmOTRiNCIsImMiOjF9';
    var title = 'Driver Monitoring Live - Trip Analysis';
    var allowfullscreen = "true"
    return res.send({ message: "Drivers status", src: src, title: title, isFullScreen: allowfullscreen });
}


module.exports = {
    CreateAction,
    CreateActionNotes,
    UpdateActionResponseType,
    UpdateActionStatus,
    GetActionByEmail,
    GetActionNoteByEmail,
    GetActionCountByStatus,
    GetStakeholders,
    GetDisposition,
    GetResponseType,
    GetActionStatus,
    GetRole,
    GenerateCallLogAndCoordinate,
    GetCallLocationLogs,
    GetTripRoutes,
    iframe

};

