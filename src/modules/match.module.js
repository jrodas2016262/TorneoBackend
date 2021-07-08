'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = Schema({
    league:String,
    team1:String,
    team2:String,
    goal1: Number,
    goal2: Number
})

module.exports = mongoose.model('matches',matchSchema)