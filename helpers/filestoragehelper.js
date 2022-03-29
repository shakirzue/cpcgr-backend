const fs = require('fs');
const path = require('path')
const dotenv = require('dotenv')
dotenv.config();

// directory path
const dir = __dirname;

// create new directory
try {
    // first check if directory already exists
    //let fileUploadPath = path.join(path.dirname(),'/',);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("Directory is created.");
    } else {
        console.log("Directory already exists.");
    }
} catch (err) {
    console.log(err);
}