'use strict'

const mongoose = require("mongoose");
const app = require('./app');
const userControler = require('./src/controllers/user.controller')
//const prueba = require('./src/controllers/match.controller')
//const addteam2 = require('./src/controllers/team')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/AppTorneos', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Conexion:Correcto');
    userControler.mainStart();

    app.listen(3000, function () {

        console.log('Servidor:Correcto')
       // addteam2.addTeam()
       // prueba.run()

    })
}).catch(err => console.log(err))

