const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const users = require('./routes/user'); 

mongoose.connect(config.db, {}).
  then(
    () => {console.log('Database connected') },
    err => { console.log('Cannot connect to the database'+ err)}
);

const app = express();
app.use(passport.initialize());
require('./auth')(passport); // for authentication purpose

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser to get the values via body in API request

app.use('/api/users', users); // Router to the endpoints

const port= process.env.port  || 3001;

app.listen() => {
    console.log(`Server is running on port ${port}`);
});