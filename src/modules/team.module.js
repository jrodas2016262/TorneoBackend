'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = Schema({
    name: String,
    img: String,
    goalA: Number,
    goalC: Number,
    pts: Number,
    pj: Number,
    pg: Number,
    pe: Number,
    pp: Number,
    idLeague: String 
})

module.exports = mongoose.model('teams',teamSchema)