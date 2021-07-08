'use strict'
const express = require('express');
const userController = require('../controllers/user.controller');
const teamController = require('../controllers/team.controller');
const matchController = require('../controllers/match.controller');
const leagueController = require('../controllers/league.controller');
var md_authentication = require('../middlewares/authenticated.middleware')
var api = express.Router();


//Users
api.post('/registerUser',userController.register)
api.post('/registerAdmin',md_authentication.ensureAuth,userController.addAdmin)
api.post('/login',userController.login)
api.get('/listProfile',md_authentication.ensureAuth,userController.listProfile)
api.get('/findUserId/:idUser', userController.findUserId);
api.get('/listUsers',md_authentication.ensureAuth,userController.listUsers)
api.put('/updateProfile/:idUser',md_authentication.ensureAuth,userController.updateProfile)
api.put('/updateUsers/:idUser',md_authentication.ensureAuth,userController.updateUsers)
api.delete('/deleteProfile',md_authentication.ensureAuth,userController.deleteProfile)
api.delete('/deleteUsers/:idUser',md_authentication.ensureAuth,userController.deleteUsers)

//Teams
api.post('/addTeam',md_authentication.ensureAuth,teamController.addTeam)
api.post('/addTeamAdmin/:idLeague',md_authentication.ensureAuth,teamController.addTeamAdmin)
api.post('/addTeamUser/:idLeague',md_authentication.ensureAuth,teamController.addTeamUser)
api.get('/listTeamUser/:idLeague',md_authentication.ensureAuth,teamController.listTeamUser)
api.get('/listTeamAdmin/:idLeague',md_authentication.ensureAuth,teamController.listTeamAdmin)
api.delete('/deleteTeamUser/:idTeam',md_authentication.ensureAuth,teamController.deleteTeamUser)
api.delete('/deleteTeamAdmin/idTeam',md_authentication.ensureAuth,teamController.deleteTeamAdmin)
api.put('/updateTeamUser/:idTeam',md_authentication.ensureAuth,teamController.updateTeamUser)
api.put('/updateTeamAdmin/:idTeam',md_authentication.ensureAuth,teamController.updateTeamAdmin)
api.put('/findTeamId/:idTeam',teamController.findTeamId)


//Leagues
api.delete('/deleteLeagueAdmin/:idLeague',md_authentication.ensureAuth,leagueController.deleteLeagueAdmin)
api.delete('/deleteLeagueUser/:idLeague',md_authentication.ensureAuth,leagueController.deleteLeagueUser)
api.post('/addLeagueUser',md_authentication.ensureAuth,leagueController.addLeagueUser)
api.post('/addLeagueAdmin',md_authentication.ensureAuth,leagueController.addLeagueAdmin)
api.put('/updateLeagueAdmin/:idLeague',md_authentication.ensureAuth,leagueController.updateLeagueAdmin)
api.put('/updateLeagueUser/:idLeague',md_authentication.ensureAuth,leagueController.updateLeagueUser)
api.get('/listLeagueUser/:idUser',md_authentication.ensureAuth,leagueController.listLeagueUser)
api.get('/listLeagueAdmin',md_authentication.ensureAuth,leagueController.listLeagueAdmin)
api.get('/findLeagueId/:idLeague',leagueController.findLeagueId)

//Table
api.get('/listTablesAdmin/:idLeague',md_authentication.ensureAuth,matchController.listTablesAdmin)
api.get('/listTableUser/:idLeague',md_authentication.ensureAuth,matchController.listTableUser)

//Match
api.post('/addMatchUser/:idLeague',md_authentication.ensureAuth,matchController.addMatchUser)
api.post('/addMatchAdmin',md_authentication.ensureAuth,matchController.addMatchAdmin)
api.delete('/deleteMatchUser/:idMatch',md_authentication.ensureAuth,matchController.deleteMatchUser)
api.delete('/deleteMatchAdmin/:idMatch',md_authentication.ensureAuth,matchController.deleteMatchAdmin)
api.get('/findMatchId/:idMatch',matchController.findMatchId)
api.get('/listMatchUser/:idLeague',md_authentication.ensureAuth,matchController.listMatchUser)
api.get('/listMatchAdmin/:idLeague',md_authentication.ensureAuth,matchController.listMatchAdmin)


module.exports  = api;  