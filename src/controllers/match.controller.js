const Team = require('../modules/team.module')
const Match = require('../modules/match.module')
const League = require('../modules/league.module');
const User = require('../modules/user.module');

function addMatchAdmin(req, res) {
    let params = req.body;
    let idLeague = req.params.idLeague;
    let matchModel = new Match();
    if(req.user.role == 0){
    if ( params.idTeam1 && params.idTeam2 && params.goal1 && params.goal2) {
        if(params.idTeam1 == params.idTeam2) return res.status(500).send({ message:'No se pueden poner dos equipos iguales'})
        if(params.goal1 < 0 || params.goal2 < 0) return res.status(500).send({ message:'No se pueden ingresar valores negativos en los goles'})
        League.find({ _id: idLeague }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ message: 'Error en la petición buscar liga' })
            if (leagueFound.length <= 0) return res.status(404).send({ message: 'No se encontro la liga' })

            if (leagueFound) {
                Team.find({ _id: params.idTeam1 }).exec((err, team1Found) => {
                    if (err) return res.status(500).send({ message: 'Error en la petición buscar Team1' })
                    if (team1Found.length <= 0) return res.status(404).send({ message: 'No se encontro el Team 1' })
                    if (team1Found) {
                        Team.find({ _id: params.idTeam2 }).exec((err, team2Found) => {
                            if (err) return res.status(500).send({ message: 'Error en la petición buscar Team2' })
                            if (team2Found.length <= 0) return res.status(404).send({ message: 'No se encontro el Team 2' })
                            if (team2Found) {
                                matchModel.team1 = params.idTeam1;
                                matchModel.team2 = params.idTeam2
                                matchModel.league = idLeague;
                                matchModel.goal1 = params.goal1;
                                matchModel.goal2 = params.goal2;
                                matchModel.save((err, matchSaved) => {
                                    if (err) return res.status(500).send({ message: 'Error al guardar match' })
                                    if (matchSaved) {
                                        if (params.goal1 > params.goal2) {
                                            Team.findByIdAndUpdate(params.idTeam1, { $inc: { pts: 3, pj: 1, pg: 1, goalA: params.goal1, goalC: params.goal2} }, (err, team1Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 win1" })
                                                if (team1Updated) {
                                                    Team.findByIdAndUpdate(params.idTeam2, { $inc: { pj: 1, pp: 1,goalA: params.goal2, goalC: params.goal1} }, (err, team2Updated) => {
                                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team2" })
                                                        if (!team2Updated) return res.status(500).send({ message: "error guardar update pj team 2" })
                                                    })
                                                }

                                            })
                                        }
                                        if (params.goal1 < params.goal2) {
                                            Team.findByIdAndUpdate(params.idTeam2, { $inc: { pts: 3, pj: 1, pg: 1, goalA: params.goal2, goalC: params.goal1} }, (err, team2Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 win2" })
                                                if (team2Updated) {
                                                    Team.findByIdAndUpdate(params.idTeam1, { $inc: { pj: 1, pp: 1,goalA: params.goal1, goalC: params.goal2} }, (err, team1Updated) => {
                                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team1" })
                                                        if (!team1Updated) return res.status(500).send({ message: "error guardar update pj team 1" })
                                                    })
                                                }

                                            })
                                        }
                                        if (params.goal1 == params.goal2) {
                                            Team.findByIdAndUpdate(params.idTeam1, { $inc: { pts: 1, pj: 1, pe: 1, goalA: params.goal1, goalC: params.goal2 } }, (err, team1Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 draw1" })
                                                if (team1Updated) {
                                                    Team.findByIdAndUpdate(params.idTeam2, { $inc: { pts: 1, pj: 1, pe: 1, goalA: params.goal2, goalC: params.goal1 } }, (err, team2Updated) => {
                                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 draw2" })
                                                        if (!team2Updated) return res.status(500).send({ message: "error al guardar el team2 pts update draw2" })

                                                    })

                                                    


                                                } else {
                                                    return res.status(500).send({ message: 'error en guardar draw1' })
                                                }

                                            })
                                        }
                                        return res.status(200).send({matchSaved})

                                    } else {
                                        return res.status(500).send({ message: 'No se guardo match' })
                                    }
                                })
                            } else {
                                return res.status(500).send({ message: 'No se encontro Team2' })
                            }
                        })

                    } else {
                        return res.status(500).send({ message: 'No se encontro Team1' })
                    }
                })
            } else {
                return res.status(500).send({ message: 'No se encontro liga con ese id' })
            }

        })


    } else {
        return res.status(500).send({ message: 'Ingrese todos los parametros que se solicitan' })
    }
} else {
    return res.status(500).send({ message: 'No posee permisos'})
}
}

function addMatchUser(req, res) {
    let params = req.body;
    let idLeague = req.params.idLeague;
    let matchModel = new Match();
    if ( params.idTeam1 && params.idTeam2 && params.goal1 && params.goal2) {
        if(params.idTeam1 == params.idTeam2) return res.status(500).send({ message:'No se pueden poner dos equipos iguales'})
        if(params.goal1 < 0 || params.goal2 < 0) return res.status(500).send({ message:'No se pueden ingresar valores negativos en los goles'})
        
        League.find({ _id: idLeague }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ message: 'Error en la petición buscar liga' })
            if (leagueFound.length <= 0) return res.status(404).send({ message: 'No se encontro la liga' })
            if(leagueFound[0]['owner'] != req.user.sub) return res.status(500).send({ message:'no puede agregar partidos a otras ligas'})
            if (leagueFound) {
                Team.find({ _id: params.idTeam1 }).exec((err, team1Found) => {
                    if (err) return res.status(500).send({ message: 'Error en la petición buscar Team1' })
                    if (team1Found.length <= 0) return res.status(404).send({ message: 'No se encontro el Team 1' })
                    if (team1Found) {
                        Team.find({ _id: params.idTeam2 }).exec((err, team2Found) => {
                            if (err) return res.status(500).send({ message: 'Error en la petición buscar Team2' })
                            if (team2Found.length <= 0) return res.status(404).send({ message: 'No se encontro el Team 2' })
                            if (team2Found) {
                                matchModel.team1 = params.idTeam1;
                                matchModel.team2 = params.idTeam2
                                matchModel.league = idLeague;
                                matchModel.goal1 = params.goal1;
                                matchModel.goal2 = params.goal2;
                                matchModel.save((err, matchSaved) => {
                                    if (err) return res.status(500).send({ message: 'Error al guardar match' })
                                    if (matchSaved) {
                                        if (params.goal1 > params.goal2) {
                                            Team.findByIdAndUpdate(params.idTeam1, { $inc: { pts: 3, pj: 1, pg: 1, goalA: params.goal1, goalC: params.goal2} }, (err, team1Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 win1" })
                                                if (team1Updated) {
                                                    Team.findByIdAndUpdate(params.idTeam2, { $inc: { pj: 1, pp: 1,goalA: params.goal2, goalC: params.goal1} }, (err, team2Updated) => {
                                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team2" })
                                                        if (!team2Updated) return res.status(500).send({ message: "error guardar update pj team 2" })
                                                    })
                                                }

                                            })
                                        }
                                        if (params.goal1 < params.goal2) {
                                            Team.findByIdAndUpdate(params.idTeam2, { $inc: { pts: 3, pj: 1, pg: 1, goalA: params.goal2, goalC: params.goal1} }, (err, team2Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 win2" })
                                                if (team2Updated) {
                                                    Team.findByIdAndUpdate(params.idTeam1, { $inc: { pj: 1, pp: 1,goalA: params.goal1, goalC: params.goal2} }, (err, team1Updated) => {
                                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team1" })
                                                        if (!team1Updated) return res.status(500).send({ message: "error guardar update pj team 1" })
                                                    })
                                                }

                                            })
                                        }
                                        if (params.goal1 == params.goal2) {
                                            Team.findByIdAndUpdate(params.idTeam1, { $inc: { pts: 1, pj: 1, pe: 1, goalA: params.goal1, goalC: params.goal2 } }, (err, team1Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 draw1" })
                                                if (team1Updated) {
                                                    Team.findByIdAndUpdate(params.idTeam2, { $inc: { pts: 1, pj: 1, pe: 1, goalA: params.goal2, goalC: params.goal1 } }, (err, team2Updated) => {
                                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 draw2" })
                                                        if (!team2Updated) return res.status(500).send({ message: "error al guardar el team2 pts update draw2" })

                                                    })

                                                    


                                                } else {
                                                    return res.status(500).send({ message: 'error en guardar draw1' })
                                                }

                                            })
                                        }
                                        return res.status(200).send({matchSaved})

                                    } else {
                                        return res.status(500).send({ message: 'No se guardo match' })
                                    }
                                })
                            } else {
                                return res.status(500).send({ message: 'No se encontro Team2' })
                            }
                        })

                    } else {
                        return res.status(500).send({ message: 'No se encontro Team1' })
                    }
                })
            } else {
                return res.status(500).send({ message: 'No se encontro liga con ese id' })
            }

        })


    } else {
        return res.status(500).send({ message: 'Ingrese todos los parametros que se solicitan' })
    }

}

function deleteMatchUser(req, res){
    let params = req.params;
    if(params.idMatch){
        Match.find({_id: params.idMatch}).exec((err, matchFound) => {
            if(err) return res.status(500).send({ message: 'Error en la petición buscar match'})
            if(matchFound && matchFound.length > 0){
                var idLeague  = matchFound[0]["league"]
                var idMatch1 = matchFound[0]["_id"]
                
                League.find({_id: idLeague}).exec((err, leagueFound) => {
                    if(err) return res.status(500).send({ message:"error al buscar la liga del match"})
                    if(leagueFound && leagueFound.length > 0){
                    idLeagueUser = leagueFound[0]["owner"];
                    if(idLeagueUser == req.user.sub){
                          Match.findByIdAndDelete(idMatch1,(err,matchDeleted) => {
                            if(err) return res.status(500).send({ message:"Error en la peticion eliminar match"})

                            if(matchDeleted){
                                if (matchFound[0]["goal1"] > matchFound[0]["goal2"]) {
                                    Team.findByIdAndUpdate(matchFound[0]["team1"], { $inc: { pts: -3, pj: -1, pg: -1, goalA: -matchFound[0]["goal1"], goalC: -matchFound[0]["goal2"]} }, (err, team1Updated) => {
                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 win1" })
                                        if (team1Updated) {
                                            Team.findByIdAndUpdate(matchFound[0]['team2'], { $inc: { pj: -1, pp: -1,goalA: -matchFound[0]["goal2"],goalC: -matchFound[0]["goal1"]} }, (err, team2Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team2" })
                                                if (!team2Updated) return res.status(500).send({ message: "error guardar update pj team 2" })
                                                return res.status(200).send({matchFound})
                                            })
                                        }

                                    })  
                                } 
                                if(matchFound[0]["goal1"] < matchFound[0]["goal2"]){
                                    Team.findByIdAndUpdate(matchFound[0]["team2"], { $inc: { pts: -3, pj: -1, pg: -1, goalA: -matchFound[0]["goal2"], goalC: -matchFound[0]["goal1"]} }, (err, team2Updated) => {
                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 win2" })
                                        if (team2Updated) {
                                            Team.findByIdAndUpdate(matchFound[0]["team1"], { $inc: { pj: -1, pp: -1,goalA: -matchFound[0]["goal1"], goalC: -matchFound[0]["goal2"]} }, (err, team1Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team1" })
                                                if (!team1Updated) return res.status(500).send({ message: "error guardar update pj team 1" })
                                                return res.status(200).send({matchFound})
                                            })
                                        }

                                    })

                                }
                                if(matchFound[0]["goal1"] == matchFound[0]["goal2"]){
                                    Team.findByIdAndUpdate(matchFound[0]["team1"], { $inc: { pts: -1, pj: -1, pe: -1, goalA: -matchFound[0]["goal1"] , goalC: -matchFound[0]["goal2"] } }, (err, team1Updated) => {
                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 draw1" })
                                        if (team1Updated) {
                                            Team.findByIdAndUpdate(matchFound[0]["team2"], { $inc: { pts: -1, pj: -1, pe: -1, goalA: -matchFound[0]["goal2"], goalC: -matchFound[0]["goal1"] } }, (err, team2Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 draw2" })
                                                if (!team2Updated) return res.status(500).send({ message: "error al guardar el team2 pts update draw2" })
                                                return res.status(200).send({matchFound})
                                            })

                                            


                                        } else {
                                            return res.status(500).send({ message: 'error en guardar draw1' })
                                        }

                                    })

                                }
                                
                            }else{ 

                                return res.status(500).send({ message: 'No se encotro el match que desea elimianr 2'})
                            }


                          })
                    }else{
                        return res.status(500).send({ message: 'No puede eliminar match que no pertenezcan a su liga'})
                    }
                    
                    }else{
                        return res.status(500).send({ message: 'No existe una liga con es id del match'})
                    }
                })
            }else{
                return res.status(500).send({ message: 'No existe un match con ese id'})
            }




        })

    }else {
        return res.status(500).send({ message: 'Ingrese los parametros solcitados'})
    }
}
function deleteMatchAdmin(req, res){
    let params = req.params;
    if(req.user.sub == 0){
    if(params.idMatch){
        Match.find({_id: params.idMatch}).exec((err, matchFound) => {
            if(err) return res.status(500).send({ message: 'Error en la petición buscar match'})
            if(matchFound && matchFound.length > 0){
                var idLeague  = matchFound[0]["league"]
                var idMatch1 = matchFound[0]["_id"]

                League.find({_id: idLeague}).exec((err, leagueFound) => {
                    if(err) return res.status(500).send({ message:"error al buscar la liga del match"})
                    if(leagueFound && leagueFound.length > 0){
                    idLeagueUser = leagueFound[0]["owner"];
                    
                          Match.findByIdAndDelete(idMatch1,(err,matchDeleted) => {
                            if(err) return res.status(500).send({ message:"Error en la peticion eliminar match"})

                            if(matchDeleted){
                                if (matchFound[0]["goal1"] > matchFound[0]["goal2"]) {
                                    Team.findByIdAndUpdate(matchFound[0]["team1"], { $inc: { pts: -3, pj: -1, pg: -1, goalA: -matchFound[0]["goal1"], goalC: -matchFound[0]["goal2"]} }, (err, team1Updated) => {
                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 win1" })
                                        if (team1Updated) {
                                            Team.findByIdAndUpdate(matchFound[0]['team2'], { $inc: { pj: -1, pp: -1,goalA: -matchFound[0]["goal2"],goalC: -matchFound[0]["goal1"]} }, (err, team2Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team2" })
                                                if (!team2Updated) return res.status(500).send({ message: "error guardar update pj team 2" })
                                                return res.status(200).send({matchFound})
                                            })
                                        }

                                    })  
                                } 
                                if(matchFound[0]["goal1"] < matchFound[0]["goal2"]){
                                    Team.findByIdAndUpdate(matchFound[0]["team2"], { $inc: { pts: -3, pj: -1, pg: -1, goalA: -matchFound[0]["goal2"], goalC: -matchFound[0]["goal1"]} }, (err, team2Updated) => {
                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 win2" })
                                        if (team2Updated) {
                                            Team.findByIdAndUpdate(matchFound[0]["team1"], { $inc: { pj: -1, pp: -1,goalA: -matchFound[0]["goal1"], goalC: -matchFound[0]["goal2"]} }, (err, team1Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pj team1" })
                                                if (!team1Updated) return res.status(500).send({ message: "error guardar update pj team 1" })
                                                return res.status(200).send({matchFound})
                                            })
                                        }

                                    })

                                }
                                if(matchFound[0]["goal1"] == matchFound[0]["goal2"]){
                                    Team.findByIdAndUpdate(matchFound[0]["team1"], { $inc: { pts: -1, pj: -1, pe: -1, goalA: -matchFound[0]["goal1"] , goalC: -matchFound[0]["goal2"] } }, (err, team1Updated) => {
                                        if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 1 draw1" })
                                        if (team1Updated) {
                                            Team.findByIdAndUpdate(matchFound[0]["team2"], { $inc: { pts: -1, pj: -1, pe: -1, goalA: -matchFound[0]["goal2"], goalC: -matchFound[0]["goal1"] } }, (err, team2Updated) => {
                                                if (err) return res.status(500).send({ message: "error en la peticion actualizar pts team 2 draw2" })
                                                if (!team2Updated) return res.status(500).send({ message: "error al guardar el team2 pts update draw2" })
                                                return res.status(200).send({matchFound})
                                            })

                                            


                                        } else {
                                            return res.status(500).send({ message: 'error en guardar draw1' })
                                        }

                                    })

                                }
                                
                            }else{ 

                                return res.status(500).send({ message: 'No se encotro el match que desea elimianr 2'})
                            }


                          })
                    
                    
                    }else{
                        return res.status(500).send({ message: 'No existe una liga con es id del match'})
                    }
                })
            }else{
                return res.status(500).send({ message: 'No existe un match con ese id'})
            }




        })

    }else {
        return res.status(500).send({ message: 'Ingrese los parametros solcitados'})
    }
} else {
    return res.status(500).send({ message: 'No posee permisos'})
}


}

function listTablesAdmin(req,res) {
    let params = req.params;
    if(params.idLeague){
    if(req.user.role == 0){
        Team.find({idLeague: params.idLeague}).sort({pts: -1, goalA:-1}).exec((err,tableFound)=>{
            if(err) return res.status(500).send({ message:'Error en la peticion buscar tabla'})
            if(tableFound.length <= 0) return res.status(500).send({ message:'No existen equipos en esa liga o no existe esa liga'})
            return res.status(200).send(tableFound)

        })
    }else{
            return res.status(500).send({ message: 'No posee permisos'})
        }

    }else{
        return res.status(500).send({ message: 'Ingrese los parametros solicitados'})
    }
}

function listTableUser(req,res) {
    params = req.params;
    if(params.idLeague){
        League.find({ _id: params.idLeague}).exec((err,leagueFound)=>{
            if(err) return res.status(500).send({ message:"error en la petición buscar liga"})
            if( leagueFound.length <= 0) return res.status(500).send({ message:'No existe esa liga'})
            if(leagueFound[0]["owner"] != req.user.sub) return res.status(500).send({message:'No puede ver una liga que no creo'})

            Team.find({idLeague: params.idLeague}).sort({pts: -1, goalA:-1}).exec((err,tableFound)=>{
                if(err) return res.status(500).send({ message:'Error en la peticion buscar tabla'})
                if(tableFound.length <= 0) return res.status(500).send({ message:'No existen equipos en esa liga'})
                return res.status(200).send({tableFound})
    
            })
            
            
        })

    } else{
        return res.status(500).send({ message: 'Ingrese los parametros que se solicitan'})
    }
}

function findMatchId(req, res){
    let params = req.params
    Match.findOne({ _id: params.idMatch }, (err, matchFound) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar match' })
        if (matchFound) {
          return res.status(200).send({ matchFound })
        } else {
          return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
      })
}



function listMatchUser(req, res){
    let params = req.params;
   
        Match.find({ League: params.idLeague }).exec((err, matchFound) => {
            if (err) return res.status(500).send({ message: "error en la petición buscar team" })
            if (teamFound.length <= 0) return res.status(500).send({ message: 'No existe un team con ese id' })

            League.find({ _id: matchFound[0]['League'] }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ message: "error en la petición buscar liga del team" })
                if (leagueFound.length <= 0) return res.status(500).send({ message: 'El team no pertenece a ninguna liga' })
                if (leagueFound[0]['owner'] == req.user.sub) {
                    return res.status(200).send({ matchFound })
                } else {
                    return res.status(500).send({ message: 'no puede ver equipos que no pertenezca ninguna de sus ligas' })
                }
            })
        })
}

function listMatchAdmin(req, res) {
    let params = req.params;
    
        if (req.user.role == 0) {
            Match.find({league: params.idLeague}).exec((err, matchFound) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion buscar team' })
                if (matchFound.length <= 0) return res.status(500).send({ message: 'No existen equipos con ese id' })
                return res.status(200).send({ matchFound })
            })
        } else {
            return res.status(500).send({ message: 'No posee permisos' })
        }

}

module.exports = {
    addMatchAdmin,
    deleteMatchUser,
    listTablesAdmin,
    listTableUser,
    findMatchId,
    addMatchUser,
    deleteMatchAdmin,
    listMatchUser,
    listMatchAdmin
}


