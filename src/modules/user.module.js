'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    user: String,
    password: String,
    email: String,
    role: Number,


})

module.exports = mongoose.model('users',userSchema)

