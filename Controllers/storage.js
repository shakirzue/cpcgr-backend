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
    res.json({
        success: "true",
        message: "File Successfully Uploaded"
    });
}

const getModules = (req, res, next) => {
    sql.connect(config)
    .then((conn) => {
        const request = conn.request();
        let query = "select Id,ModuleName from dbo.File_Module WHERE isVisible = @isVisible"
        let result = request
            .input('isVisible', sql.Bit, true)
            .query(query)
            .then((result) => {
                if (result.recordset.length > 0) {
                    return res.status(200).json({
                        success: true,
                        message: "records successfully.",
                        modules: result.recordset
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: "incorrect information has not provided"
                });
            })
            .then(() => conn.close()).catch(err => {
                console.log('error: ',err);
                return (({ success: false, message: err}));
              });
    })
}

const getFileTypesByModule = (req, res, next) => {

    sql.connect(config)
    .then((conn) => {
        const request = conn.request();
        let query = "select * from dbo.Module_File_Type WHERE ModuleId = @ModuleId"
        let result = request
            .input('ModuleId', sql.Int, req.body.ModuleId)
            .query(query)
            .then((result) => {
                if (result.recordset.length > 0) {
                    return res.json({
                        success: true,
                        message: "records successfully.",
                        filetypes: result.recordset
                    });
                }
                    return res.json({
                        success: false,
                        message: "incorrect information has not provided"
                    });
            })
            .then(() => conn.close()).catch(err => {
                console.log('error: ',err);
                return (({ success: false, message: err}));
              });
    })
}

const getFileTypeDetailByFileTypeId = (req, res, next) => {

sql.connect(config)
            .then((conn) => {
                const request = conn.request();
                let query = "select mft.[FileName], ftd.FileTypeId, ftd.RequiredColumnNumber, fcd.ColumnName from dbo.[Module_File_Type] mft inner join dbo.[File_Type_Detail] ftd on mft.Id = ftd.FileTypeId inner join dbo.[FileType_Column_Detail] fcd on ftd.Id = fcd.FileDetailId"
                let result = request                   
                    .query(query)
                    .then((result) => {
                        var allFileTypeDetails = [];
                        // send records as a response
                        if (typeof result !== "undefined" && result.recordset.length > 0) {
                            req.body.FileTypeIds.split(',').forEach(element => {
                                const finalResult = result.recordset.filter(d => d.FileTypeId.toString() === element);
                                allFileTypeDetails = allFileTypeDetails.concat(finalResult);
                            });
                            return res.json({
                                success: true,
                                message: "records successfully.",
                                filedetails: allFileTypeDetails
                            });
                        }
                        return res.json({
                            success: false,
                            message: "incorrect information has not provided"
                        });
                    })
                    .then(() => conn.close()).catch(err => {
                        console.log('error: ',err);
                        return (({ success: false, message: err}));
                      });
            })
}

module.exports = {
    blobupload,
    getModules,
    getFileTypesByModule,
    getFileTypeDetailByFileTypeId
};