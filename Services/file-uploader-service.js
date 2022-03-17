const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
const url = require('url')
const azureStorage = require('azure-storage')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config();

const instance = new express();
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

instance.use(
    fileUpload({
        createParentPath: true,
    })
);

const blobService = azureStorage.createBlobService(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_KEY
);

// function sendFile(req, res) {
//     console.log(filename);
//     console.log(path(require.main.filename));
// }

function reportUpload(request, response) {
    var fileKeys = Object.keys(request.files);

    fileKeys.forEach(function (key) {
        if (!request.files) {
            return res.status(400).send("No files are received.");
        }
        const file = request.files[key];
        const path = __dirname + "/" + process.env.TEMPORARY_FILE_UPLOAD_FOLDER_NAME + "/" + file.name;

        file.mv(path, (err) => {

            if (err) {
                return response.status(500).send(err);
            }
            return response.send({ status: "success", path: path });
        });
    });
}

function blobUpload(request, response) {
    if (request.files != null) {
        var fileKeys = Object.keys(request.files);
        fileKeys.forEach(function (key) {
            if (!request.files) {
                return response.status(400).send("No files are received.");
            }
            try {
                const file = request.files[key];              
                console.log('file to upload on blob is: ' + file.name);
                uploadFileToServer(file);
            }
            catch (ex) {
                response.write({ message: ex });
            }
        });
    }
    else {
        console.log('no file found in request');
        response.write("No files are received.")
        //response.status(400).send("No files are received.");
    }
}

const uploadFileToServer = async (file) => {
    const blobName = file.name;
    const filePath = path.join(__dirname, "/" + process.env.TEMPORARY_FILE_UPLOAD_FOLDER_NAME + "/", blobName);
    file.mv(filePath, (err) => {
        if (err) {
            console.log('Error in uploading file on server: ' + err);
            throw 'File with name "' + blobName + '" is unable to upload to server.';
        }
        else {
            console.log('File uploaded on server successfully');
            uploadFileToBlob(file);
        }
    });
};

const uploadFileToBlob = async (file) => {
    const blobName = file.name;
    const filePath = path.join(__dirname, "/" + process.env.TEMPORARY_FILE_UPLOAD_FOLDER_NAME + "/", blobName);
    const stream = fs.createReadStream(filePath);

    blobService.createBlockBlobFromStream(
        containerName,
        blobName,
        stream,
        file.size,
        (err) => {
            if (err) {
                console.log('Error in uploading file to blob storage: ' + err);
                throw 'File with name "' + blobName + '" is unable to upload to blob storage.';
            }
            else {
                console.log('File has been uploaded to blob storage successfully');
            }
            fs.unlinkSync(filePath);
        }
    );
};
module.exports = {
    reportUpload,
    blobUpload
    // ,
    // sendFile
};