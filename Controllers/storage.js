var express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require('body-parser')
var sql = require("mssql");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require('../config/config');
const fileUploader = require('../Services/file-uploader-service');


const blobupload = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');  
    fileUploader.blobUpload(req, res);
    res.json({ success: "true", message: "File Successfully Uploaded" });      
}

const getModules = (req, res, next) => {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records
        request.input('isVisible', sql.Bit, true)
        request.query('select Id,ModuleName from dbo.File_Module WHERE isVisible = @isVisible', function (err, result) {

            if (err) console.log(err)          
            // send records as a response  
           
            if (result.recordset.length > 0) {
                return res.status(200).json({ success: true, message: "records successfully.", modules: result.recordset });
            }
            return res.status(500).json({ success: false, message: "incorrect information has not provided" });
        });
    });
}

const getFileTypesByModule = (req, res, next) => {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();

        // query to the database and get the records
        request.input('ModuleId', sql.Int, req.body.ModuleId)
        request.query('select * from dbo.Module_File_Type WHERE ModuleId = @ModuleId', function (err, result) {

            if (err) console.log(err)
         
            // send records as a response           
            if (result.recordset.length > 0) {
                return res.json({ success: true, message: "records successfully.", filetypes: result.recordset });
            }
            return res.json({ success: false, message: "incorrect information has not provided" });
        });
    });
}

const getFileTypeDetailByFileTypeId = (req, res, next) => {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        request = new sql.Request();
        // query to the database and get the records
        request.query('select mft.[FileName], ftd.FileTypeId, ftd.RequiredColumnNumber, fcd.ColumnName from dbo.[Module_File_Type] mft inner join dbo.[File_Type_Detail] ftd on mft.Id = ftd.FileTypeId inner join dbo.[FileType_Column_Detail] fcd on ftd.Id = fcd.FileDetailId', function (err, result) {
            if (err) console.log(err)
            var allFileTypeDetails = [];           
            // send records as a response
            req.body.FileTypeIds.split(',').forEach(element => {               
                const finalResult = result.recordset.filter(d => d.FileTypeId.toString() === element);
                allFileTypeDetails = allFileTypeDetails.concat(finalResult);
            });
         
            if (result.recordset.length > 0) {
                return res.json({ success: true, message: "records successfully.", filedetails: allFileTypeDetails });
            }
            return res.json({ success: false, message: "incorrect information has not provided" });
        });
    });
}

module.exports = {blobupload,
    getModules,
    getFileTypesByModule,
    getFileTypeDetailByFileTypeId
};