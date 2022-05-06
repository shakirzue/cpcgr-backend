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
const powerbiRoute = require('./Routes/powerbi');
const storageRoute = require('./Routes/storage');
const cmsapistorage = require('./Routes/CMSApi');
const path = require('path');

require("dotenv").config();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '500mb', extended: true }));
app.use(express.json({ type: 'application/*+json'}));
// app.use(bodyParser.urlencoded({limit: '500mb', extended: true }));

// // parse application/json
 app.use(bodyParser.json());
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json', limit: '500mb'}));

// parse some custom thing into a Buffer
//app.use(bodyParser.raw({ type: 'application/vnd.custom-type',limit: '500mb' }));

// parse an HTML body into a string
//app.use(bodyParser.text({ type: 'text/html',limit: '500mb' }));

app.use(express.static(path.join(__dirname, "/build")));

app.use(cors({
    origin: process.env.CLIENT_PRODUCTION_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
app.use(cookieParser());

app.use(fileUpload());

app.get('/', function (req, res) {
    console.log("Welcome to CPCGR portal ");
    res.send("Welcome to CPCGR portal ");
});

console.log("Welcome to CPCGR portal ");

app.use("/user", userRoute);
app.use("/drivermonitoring", driverMonitoringRoute);
app.use("/powerbi", powerbiRoute);
app.use("/storage", storageRoute);
app.use("/cmsapi", cmsapistorage);

var port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log('Welcome to CPCGR portal: app running on port '+ port);
});
