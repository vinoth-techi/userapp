const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;