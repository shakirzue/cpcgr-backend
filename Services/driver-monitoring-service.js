const express = require('express');
const dotenv = require('dotenv');
var sql = require("mssql");
const config = require('../config/config');
const googlemapservice = require('../services/geocoding-service');
const dateformatehelper = require('../helpers/datehelper');
const stringhelper = require('../helpers/numberhelper');

dotenv.config();

function SaveSalesOrderLog(salesOrder) {
    sql.connect(config)
        .then((conn) => {
            const request = conn.request();
            var query = "INSERT INTO dbo.SalesOrder_Logs_Details VALUES "+
            "(@SalesOrderNumber, @Date, @NumberOfCallMade, @IsCustomerPhoneInLog, @CustomerAddressLatitude, "+
            "@CustomerAddressLongitude,@DifferenceInCoordinates, @DifferenceInLastCallAndSkipTimes, @TripNumber)";
            let result = request
                .input('SalesOrderNumber', sql.NVarChar, salesOrder.SalesOrderNumber)
                .input('Date', sql.NVarChar, dateformatehelper.convertformattoyyyymmdd(salesOrder.Date))
                .input('NumberOfCallMade', sql.Int, salesOrder.NumberOfCallMade)
                .input('IsCustomerPhoneInLog', sql.Bit, salesOrder.IsCustomerPhoneInCallLog)
                .input('CustomerAddressLatitude', sql.Float, salesOrder.CustomerLatitude)
                .input('CustomerAddressLongitude', sql.Float, salesOrder.CustomerLongitude)
                .input('DifferenceInCoordinates', sql.Float, salesOrder.distance)
                .input('DifferenceInLastCallAndSkipTimes', sql.Float, salesOrder.TimeDifference)
                .input('TripNumber', sql.NVarChar, salesOrder.TripNumber)
                .query(query)
                .then((result) => {
                    return true;
                })
            // .then(() => conn.close())
        })
}

async function GetDriverCallLogRecords(date) {

    return new Promise(function (resolve, reject) {
        sql.connect(config)
            .then((conn) => {

                const request = conn.request();
                var query = "SELECT CONVERT(VARCHAR(50), TIME) as TIME, DATE, PHONE, DESTINATION, [Employee Phone], " +
                    "[Employee Name] from dbo.DriverMonitoringCallLogData WHERE Date = @Date"
                let result = request
                    .input('Date', sql.NVarChar, date)
                    .query(query)
                    .then((result) => {
                        if (result.recordset.length > 0) {                           
                            resolve(result.recordset);
                        }
                        else {
                            resolve([]);
                        }
                    })
                    .then(() => conn.close())
            })
    });
}

async function GetDriverTripRecords(date) {

    return new Promise(function (resolve, reject) {
       
        sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                var query = "select ta.[Event Time] as DateTime, ta.[Trip Date] as Date,Latitude, Longitude, " +
                    "Address, ta.[Order #] as OrderNumber, [Phone #] as Phone, ea.Note, ta.[Trip #] TripNumber, " +
                    "ea.[Exception Type] as ExceptionType from dbo.DriverMonitoringTripEventActivityData ta " +
                    "inner join dbo.DriverMonitoringTripItineraryData ti on ta.[Order #]=ti.[Order #] inner join " +
                    "dbo.DriverMonitoringExceptionActivityData ea on ta.[Order #] = ea.[Order #]" +
                    "WHERE ta.Type = 'Skip Stop' AND [Trip Date] = @Date  AND ea.[Exception Type] = 'Skip Stop Exception'"+
                    " and ti.[Trip #] = ta.[Trip #] and ta.[Trip #] = ea.[Trip #]"
                let result = request
                    .input('Date', sql.NVarChar, date)
                    .query(query)
                    .then((result) => {
                        if (result.recordset.length > 0) {
                            resolve(result.recordset);
                        }
                    })
                    .then(() => conn.close())
            })
    });
}

async function CompareTripDataWithLogData(salesOrders, callLogdata, Date) {
    var newSalesOrderList = [];
    sql.connect(config)
        .then((conn) => {
            const request = conn.request();
            let result = request
                .input('Date', sql.NVarChar, dateformatehelper.convertformattoyyyymmdd(Date))
                .query("SELECT * FROM [dbo].[SalesOrder_Logs_Details] WHERE Date = @Date")
                .then((result) => {
                    if (result.recordset.length > 0) {
                        var salesorderids = result.recordset.map(function (item) {
                            return item.SalesOrderNumber;
                        });

                        var salesorderdatetime = result.recordset.map(function (item) {
                            return item.DateTime;
                        });
                    
                        salesOrders.forEach(salesorder => {
                            if (!salesorderids.includes(salesorder.OrderNumber)) {                               
                                if (!salesorderdatetime.includes(salesorder.DateTime)) {                                  
                                    //newSalesOrderList.push(salesorder);
                                    StoreSalesOrder(salesorder, callLogdata);
                                }                                
                            }
                        });

                        // salesOrders.forEach(salesorder => {
                        //     if (!salesorderids.includes(salesorder.OrderNumber)) {
                        //         newSalesOrderList.push(salesorder);
                        //         //StoreSalesOrder(salesorder, callLogdata);//new line add to fix issue
                        //     }
                        // });

                        // newSalesOrderList.forEach(salesorder => {
                        //     StoreSalesOrder(salesorder, callLogdata)
                        // });

                    }
                    else {
                        salesOrders.forEach(salesorder => {
                            StoreSalesOrder(salesorder, callLogdata)
                        });
                    }
                })
                .then(() => conn.close()).then(() => { return true; })
        })
}


function checkCallLogDetail(salesOrder, callLogDetails) {
    var numberOfCallMade = 0;
    var callAndStopTimesDiff;
    if (callLogDetails.length > 0) {
        callLogDetails.forEach(calldetail => {

            let salesorderdate = dateformatehelper.convertformattommddyyyy(salesOrder.Date);
            let calllogdate = dateformatehelper.convertdateobjectformat(calldetail.DATE);           
            let salesordertime = dateformatehelper.extractTimeFromDate(salesOrder.DateTime);

            let calledPhone = stringhelper.getnumberfromstring(calldetail.PHONE);
            let customerPhone = stringhelper.getnumberfromstring(salesOrder.Phone);
            
            if (calllogdate === salesorderdate &&
                calledPhone === customerPhone) {
                callAndStopTimesDiff = dateformatehelper.convertstrtimetotime(salesordertime, calldetail.TIME);
                numberOfCallMade++;
            }
        });
    }
    return { numberOfCallMade, callAndStopTimesDiff };
}

async function StoreSalesOrder(salesorder, callLogdata) {

    var coordinates = await googlemapservice.calculateCustomerAddressGeoCoordinates(salesorder.Address);
    var differenceInCoordinate = await googlemapservice.calculateDistanceByGeoCoordinates(salesorder.Latitude, coordinates.Latitude, salesorder.Longitude, coordinates.Longitude);
   
    var isPhoneFoundInLog;
    let { numberOfCallMade, callAndStopTimesDiff } = checkCallLogDetail(salesorder, callLogdata);
    if (numberOfCallMade > 0) {
        isPhoneFoundInLog = true;
    }
    else {
        isPhoneFoundInLog = false;
    }

    SaveSalesOrderLog({
        SalesOrderNumber: salesorder.OrderNumber, Date: salesorder.Date, NumberOfCallMade: numberOfCallMade,
        IsCustomerPhoneInCallLog: isPhoneFoundInLog, CustomerLatitude: coordinates.Latitude,
        CustomerLongitude: coordinates.Longitude, distance: differenceInCoordinate, 
        TimeDifference: callAndStopTimesDiff, TripNumber: salesorder.TripNumber
    });

}

module.exports = {
    SaveSalesOrderLog,
    checkCallLogDetail,
    GetDriverCallLogRecords,
    GetDriverTripRecords,
    CompareTripDataWithLogData
};