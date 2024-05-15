/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todoHandler');

// express app initialization
const app = express();
app.use(express.json());

// database connection
mongoose
    .connect(
        'mongodb+srv://yeasin:yeasin8664@tasks.qgfpx84.mongodb.net/todo?retryWrites=true&w=majority&appName=tasks'
    )
    .then(() => {
        console.log('Connection successful');
    })
    .catch((err) => {
        console.log(err);
    });

// application route
app.use('/todo', todoHandler);

// default error handling
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
    }
    res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(4000, () => {
    console.log('Listening to port 4000');
});
