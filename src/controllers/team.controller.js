'use strict'
const Team = require('../modules/team.module')
const League = require('../modules/league.module')

function addTeam(req, res) {
    let params = req.body
    let teamModel = new Team()
    if (params.name && params.idLeague) {
        teamModel.name = params.name;
        teamModel.idLeague = params.idLeague;
        teamModel.goalA = 0;
        teamModel.goalC = 0;
        teamModel.pj = 0;
        teamModel.pg = 0;
        teamModel.pe = 0;
        teamModel.pp = 0;
        teamModel.pts = 0;

        League.find({ _id: params.idLeague }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ message: "error en la petición buscar liga" })
            if (leagueFound.length <= 0) return res.status(500).send({ message: 'No existe esa liga' })
            Team.find({ idLeague: params.idLeague }).countDocuments((err, teamCount) => {
                if (err) return res.status(500).send({ message: "error al contar equipos de la liga" })
                if (teamCount >= 10) return res.status(500).send({ message: 'La liga tiene un maximo de 10 teams' })
                if (leagueFound[0]["owner"] != req.user.sub) return res.status(500).send({ message: 'No puede ingresar equipos a ligas que no creo' })
                Team.find({ name: params.name, idLeague: params.idLeague }).exec((err, teamFound) => {
                    if (err) return res.status(500).send({ message: "error en la petición buscar team" })
                    if (teamFound && teamFound.length > 0) return res.status(500).send({ message: 'ya existe un equipo en la liga con ese nombre' })

                    teamModel.save((err, teamSaved) => {
                        if (err) return res.status(500).send({ message: "error en la petición guardar team" })
                        return res.status(200).send({ teamSaved })

                    })


                })
            })
        })


    } else {
        return res.status(500).send({ message: 'ingres los parametros solicitados' })
    }

}
function addTeamUser(req, res) {
    let params = req.body
    var idLeague = req.params.idLeague;
    let teamModel = new Team()

    let idLeague = req.params.idLeague
    if (params.name && params.img) {
        teamModel.name = params.name;
        teamModel.idLeague = idLeague;
        teamModel.img= params.img;
        teamModel.goalA = 0;
        teamModel.goalC = 0;
        teamModel.pj = 0;
        teamModel.pg = 0;
        teamModel.pe = 0;
        teamModel.pp = 0;
        teamModel.pts = 0;

        League.find({ _id: idLeague }).exec((err, leagueFound) => {
            if (err) return res.status(500).send({ message: "error en la petición buscar liga" })
            if (leagueFound.length <= 0) return res.status(500).send({ message: 'No existe esa liga' })
            Team.find({ idLeague: idLeague }).countDocuments((err, teamCount) => {
                if (err) return res.status(500).send({ message: "error al contar equipos de la liga" })
                if (teamCount >= 10) return res.status(500).send({ message: 'La liga tiene un maximo de 10 teams' })
                if (leagueFound[0]["owner"] != req.user.sub) return res.status(500).send({ message: 'No puede ingresar equipos a ligas que no creo' })
                Team.find({ name: params.name, idLeague: idLeague }).exec((err, teamFound) => {
                    if (err) return res.status(500).send({ message: "error en la petición buscar team" })
                    if (teamFound && teamFound.length > 0) return res.status(500).send({ message: 'ya existe un equipo en la liga con ese nombre' })

                    teamModel.save((err, teamSaved) => {
                        if (err) return res.status(500).send({ message: "error en la petición guardar team" })
                        return res.status(200).send({ teamSaved })

                    })


                })
            })
        })


    } else {
        return res.status(500).send({ message: 'ingres los parametros solicitados' })
    }

}
function addTeamAdmin(req, res) {
    let params = req.body
    let idLeague = req.params.idLeague
    let teamModel = new Team()
    if (req.user.role == 0) {
        if (params.name && params.idLeague) {
            teamModel.name = params.name;
            teamModel.img = params.img;
            teamModel.idLeague = idLeague;
            teamModel.goalA = 0;
            teamModel.goalC = 0;
            teamModel.pj = 0;
            teamModel.pg = 0;
            teamModel.pe = 0;
            teamModel.pp = 0;
            teamModel.pts = 0;

            League.find({ _id: idLeague }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ message: "error en la petición buscar liga" })
                if (leagueFound.length <= 0) return res.status(500).send({ message: 'No existe esa liga' })
                Team.find({ idLeague: idLeague }).countDocuments((err, teamCount) => {
                    if (err) return res.status(500).send({ message: "error al contar equipos de la liga" })
                    if (teamCount >= 10) return res.status(500).send({ message: 'La liga tiene un maximo de 10 teams' })
                    Team.find({ name: params.name, idLeague: idLeague }).exec((err, teamFound) => {
                        if (err) return res.status(500).send({ message: "error en la petición buscar team" })
                        if (teamFound && teamFound.length > 0) return res.status(500).send({ message: 'ya existe un equipo en la liga con ese nombre' })

                        teamModel.save((err, teamSaved) => {
                            if (err) return res.status(500).send({ message: "error en la petición guardar team" })
                            return res.status(200).send({ teamSaved })
                        })
                    })
                })
            })
        } else {
            return res.status(500).send({ message: 'ingres los parametros solicitados' })
        }
    } else {
        return res.status(500).send({ message: "no posee permisos para realizar esta accion" })
    }
}
function listTeamUser(req, res) {
  let params = req.params;
 
      Team.find({ idLeague: params.idLeague }).exec((err, teamFound) => {
          if (err) return res.status(500).send({ message: "error en la petición buscar team" })
          if (teamFound.length <= 0) return res.status(500).send({ message: 'No existe un team con ese id' })

          League.find({ _id: teamFound[0]['idLeague'] }).exec((err, leagueFound) => {
              if (err) return res.status(500).send({ message: "error en la petición buscar liga del team" })
              if (leagueFound.length <= 0) return res.status(500).send({ message: 'El team no pertenece a ninguna liga' })
              if (leagueFound[0]['owner'] == req.user.sub) {
                  return res.status(200).send({ teamFound })
              } else {
                  return res.status(500).send({ message: 'no puede ver equipos que no pertenezca ninguna de sus ligas' })
              }
          })
      })
  
  
}
function listTeamAdmin(req, res) {
  let params = req.params;
  
      if (req.user.role == 0) {
          Team.find({idLeague: params.idLeague}).exec((err, teamFound) => {
              if (err) return res.status(500).send({ message: 'Error en la peticion buscar team' })
              if (teamFound.length <= 0) return res.status(500).send({ message: 'No existen equipos con ese id' })
              return res.status(200).send({ teamFound })
          })
      } else {
          return res.status(500).send({ message: 'No posee permisos' })
      }  
}
function deleteTeamUser(req, res) {
    let params = req.params;
    if (params.idTeam) {
        Team.find({ _id: params.idTeam }).exec((err, teamFound) => {
            if (err) return res.status(500).send({ message: "error en la petición buscar team" })
            if (teamFound.length <= 0) return res.status(500).send({ message: 'No existe un team con ese id' })

            League.find({ _id: teamFound[0]['idLeague'] }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ message: "error en la petición buscar liga del team" })
                if (leagueFound.length <= 0) return res.status(500).send({ message: 'El team no pertenece a ninguna liga' })
                if (leagueFound[0]['owner'] == req.user.sub) {
                    Team.findByIdAndDelete(params.idTeam, (err, teamDeleted) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion eliminar team" })
                        return res.status(200).send({ teamDeleted })
                    })
                } else {
                    return res.status(500).send({ message: 'no puede eliminar equipos que no pertenezca ninguna de sus ligas' })
                }
            })
        })
    } else {
        return res.status(500).send({ message: 'ingres los parametros solicitados' })
    }

}
function deleteTeamAdmin(req, res) {
    let params = req.params;
    if (params.idTeam) {
        if (req.user.role == 0) {
            Team.find({ _id: params.idTeam }).exec((err, teamFound) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion buscar team' })
                if (teamFound.length <= 0) return res.status(500).send({ message: 'No existen equipos con ese id' })
                Team.findByIdAndDelete(params.idTeam, (err, teamDeleted) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion eliminar team' })
                    return res.status(200).send({ teamDeleted })
                })
            })
        } else {
            return res.status(500).send({ message: 'No posee permisos' })
        }

    } else {
        return res.status(500).send({ message: 'Ingrese los parametros solicitados' })
    }
}

function updateTeamUser(req, res) {
    let params = req.params;
    if (params.idTeam) {
        Team.find({ _id: params.idTeam }).exec((err, teamFound) => {
            if (err) return res.status(500).send({ message: "error en la petición buscar team" })
            if (teamFound.length <= 0) return res.status(500).send({ message: 'No existe un team con ese id' })

            League.find({ _id: teamFound[0]['idLeague'] }).exec((err, leagueFound) => {
                if (err) return res.status(500).send({ message: "error en la petición buscar liga del team" })
                if (leagueFound.length <= 0) return res.status(500).send({ message: 'El team no pertenece a ninguna liga' })
                if (leagueFound[0]['owner'] == req.user.sub) {
                    Team.findByIdAndUpdate(params.idTeam, params, { new: true }, (err, teamUpdated) => {
                        if (err) return res.status(500).send({ message: "error en la petición editar  team" })
                        return res.status(200).send({ teamUpdated })

                    })
                } else {
                    return res.status(500).send({ message: 'no puede editar equipos que no pertenezca ninguna de sus ligas' })
                }
            })
        })
    } else {
        return res.status(500).send({ message: 'ingres los parametros solicitados' })
    }


}

function updateTeamAdmin(req, res) {
    let params = req.params;
    if (params.idTeam) {
        if (req.user.role == 0) {
            Team.find({ _id: params.idTeam }).exec((err, teamFound) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion buscar team' })
                if (teamFound.length <= 0) return res.status(500).send({ message: 'No existen equipos con ese id' })
                Team.findByIdAndUpdate(params.idTeam, params, { new: true }, (err, teamUpdated) => {
                    if (err) return res.status(500).send({ message: "error en la petición editar  team" })
                    return res.status(200).send({ teamUpdated })
                })
            })
        } else {
            return res.status(500).send({ message: 'No posee permisos' })
        }

    } else {
        return res.status(500).send({ message: 'Ingrese los parametros solicitados' })
    }
}

function findTeamId(req, res){
    var idTeam = req.params.idTeam;
    Team.findOne({ _id: idTeam }, (err, teamFind) => {
        if (err) return res.status(500).send({ mensaje: 'Error al solicitar equipo' })
        if (teamFind) {
          return res.status(200).send({ teamFind })
        } else {
          return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
      })
}





module.exports = {
    addTeam,
    addTeamAdmin,
    listTeamUser,
    listTeamAdmin,
    deleteTeamUser,
    deleteTeamAdmin,
    updateTeamUser,
    updateTeamAdmin,
    findTeamId,
    addTeamUser
}