var express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require('body-parser')
var sql = require("mssql");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require('../config/config');


const getWipsam = (req, res, next) => {
    var modelId = req.body.ModuleId;

    sql.connect(config, function (err) {
        request = new sql.Request();
        let query = "SELECT * FROM [dbo].[Module_File_Type] Where [ModuleId] =" + modelId;
        let data1;
        request.query(query, async (err, result) => {
            if (err) {console.log(err);return res.json({
                success: false,
                message: "unable to fetch record"
            })};

            if (result.recordset.length > 0) {
                data1 = result.recordset;
                return res.json({
                    success: true,
                    message: "Success",
                    data: data1
                });
            } else {
                return res.json({
                    success: false,
                    message: "unable to fetch record"
                });
            }
        });
    });

}


module.exports = {
    getWipsam
};