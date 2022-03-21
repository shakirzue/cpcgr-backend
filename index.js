var express = require('express');
var cors = require('cors');
var app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
var sql = require("mssql");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const driverMonitoringRoute = require('./Routes/driverMonitoring');
const userRoute = require('./Routes/user');
const wipsamRoute = require('./Routes/wipsam');
const storageRoute = require('./Routes/storage');

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));

app.use(cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(cookieParser());

app.use(fileUpload());

app.get('/', cors(), function (req, res) {
    console.log("Welcome to Zue Driver monitoring");
    res.send("Welcome to Zue Driver monitoring");
});

console.log("Welcome to Zue Driver monitoring");


app.use("/user", userRoute);
app.use("/drivermonitoring", driverMonitoringRoute);
app.use("/wipsam", wipsamRoute);
app.use("/storage", storageRoute);


var port = process.env.PORT || 3001;
app.listen(port);
  