/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const multer = require('multer');
const path = require('path');

// upload file
const UPLOAD_FOLDER = './uploads/';

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        // define file name
        const fileExt = path.extname(file.originalname);
        const fileName = `${file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-')}-${Date.now()}`;

        cb(null, fileName + fileExt);
    },
});

// create environment for multer
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000, // 1 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            if (
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/png'
            ) {
                cb(null, true);
            } else cb(new Error('Only .jpg, .jpeg and .png file are allowed!'));
        } else if (file.fieldname === 'doc') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else cb(new Error('Only pdf file allowed!'));
        } else cb(new Error('There is an unknown error!'));
    },
});

const app = express();

// application route
app.post(
    '/',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'doc', maxCount: 1 },
    ]),
    (req, res) => {
        console.log(req.files);
        res.send('Home');
    }
);

// default error handling
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('There was a upload error!');
        } else res.status(500).send(err.message);
    } else res.send('Success!');
});

app.listen(4000, () => {
    console.log('Listening to port 4000');
});
