'use strict'
const User = require('../modules/user.module')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt.service')

function mainStart(req, res) {
  let userModel = new User();

  userModel.user = 'ADMIN'
  userModel.password = 'deportes123'
  userModel.email = 'mainAdmin@gmail.com'
  userModel.role = 0

  User.find({ user: userModel.user }, (err, userFind) => {
    if (err) return console.log("ERROR en la peticion")

    if (userFind && userFind.length >= 1) {
      console.log("Usuario Admin creado!")
    } else {
      bcrypt.hash(userModel.password, null, null, (err, passCrypt) => {
        userModel.password = passCrypt;
      })

      userModel.save((err, saveUser) => {
        if (err) return console.log("ERROR al crear el usuario Admin")

        if (saveUser) {
          console.log("Usuario Creado")
        }
      })
    }
  })
}

function register(req, res) {
  let userModel = new User()
  let params = req.body
  console.log(params)
  if (params.user && params.password && params.email) {
    userModel.user = params.user;
    userModel.password = params.password;
    userModel.email = params.email;
    userModel.role = 1;

    User.find({ user: params.user }).exec((err, userFound) => {
      if (err) return res.status(500).send({ mensaje: 'Error en la busqueda de usuario' });
      if (userFound && userFound.length > 0) {
        return res.status(200).send({ mensaje: 'El usuario ya existe' })
      } else {
        bcrypt.hash(params.password, null, null, (err, passE) => {
          userModel.password = passE;
          userModel.save((err, userSaved) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion guardar' });
            if (userSaved) {
              return res.status(200).send({ userSaved })
            }

          })
        })
      }
    })

  } else {
    return res.status(500).send({ mensaje: 'Ingrese todos los campos' })
  }
}

function login(req, res) {
  let params = req.body;

  if (params.user && params.password) {
    User.findOne({ user: params.user }, (err, userFound) => {
      if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
      if (userFound) {
        bcrypt.compare(params.password, userFound.password, (err, passCorrect) => {

          if (passCorrect) {
            userFound.password = undefined;
            return res.status(200).send({ token: jwt.userToken(userFound), userFound })
          } else {
            return res.status(404).send({ mensaje: 'Password incorrecta' })
          }
        })
      } else {
        return res.status(404).send({ mensaje: 'User no encontrado' })
      }
    })
  } else {
    return res.status(500).send({ mensaje: 'Ingrese todos los campos' })
  }
}

function addAdmin(req, res) {
  let params = req.body;
  let userModel = new User();
  if (req.user.role == 0) {
    if (params.email && params.password && params.user) {
      userModel.user = params.user;
      userModel.email = params.email;
      userModel.password = params.password
      userModel.role = 0;

      User.find({ user: params.user }).exec((err, userFound) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la busqueda de usuario' });
        if (userFound && userFound.length > 0) {
          return res.status(200).send({ mensaje: 'El usuario ya existe' })
        } else {
          bcrypt.hash(params.password, null, null, (err, passE) => {
            userModel.password = passE;
            userModel.save((err, userSaved) => {
              if (err) return res.status(500).send({ mensaje: 'Error en la peticion guardar' });
              if (userSaved) {
                return res.status(200).send({ userSaved })
              }

            })
          })
        }
      })
    } else {
      return res.status(500).send({ mensaje: 'Ingrese todos los campos' })
    }
  } else {
    return res.status(500).send({ mensaje: 'No posee permisos para agregar un administrador' })
  }
}

function listProfile(req, res) {
  User.find({ _id: req.user.sub }).exec((err, userFound) => {
    if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
    return res.status(200).send({ userFound })

  })
}

function listUsers(req, res) {
  if (req.user.role == 0) {
    User.find().exec((err, usersFound) => {
      if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
      return res.status(200).send({ usersFound })

    })

  } else {
    return res.status(500).send({ mensaje: 'No posee permisos' })
  }
}

function updateProfile(req, res) {
  let params = req.body
  var idUser = req.params.idUser;

  User.findByIdAndUpdate(idUser, params, { new: true }, (err, userUpdated) => {
    if (err) return res.status(500).send({ mensaje: 'error en la peticion xads' })
    if (!userUpdated) return res.status(500).send({ mensaje: 'error al actualizar perfil' })
    return res.status(200).send({ userUpdated })

  })
}

function updateUsers(req, res) {
  var idUser = req.params.idUser;
  var params = req.body;

  if (req.user.role == 0) {
    User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFind) => {
      if (err) return res.status(500).send({ mensaje: 'ERROR en la solicitud de datos' })
      if (!userFind) return res.status(500).send({ mensaje: 'Error al actualizar usuario' })
      return res.status(200).send({ userFind })
    })
  } else {
    return res.status(500).send({ mensaje: 'Este usuario no puede modificar' })
  }
}

function deleteProfile(req, res) {
  User.findByIdAndDelete(req.user.sub, (err, userDeleted) => {
    if (err) return res.status(500).send({ mensaje: 'error en la peticion eliminar' })
    if (!userDeleted) return res.status(500).send({ mensaje: 'error al eliminar usuario' })
    return res.status(200).send({ userDeleted })
  })
}

function deleteUsers(req, res) {
  var idUser = req.params.idUser;

  if (req.user.role == 0) {
    User.findByIdAndDelete(idUser, (err, userDeleted) => {
      if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar eliminar usuario' })
      if (!userDeleted) return res.status(500).send({ mensaje: 'ERROR al eliminar al usuario' })

      return res.status(200).send({ mensaje: 'Usuario eliminado' })
    })
  } else {
    return res.status(500).send({ mensaje: 'No puede modificar este usuario' })
  }
}

function findUserId(req, res) {
  var idUser = req.params.idUser;

  User.findOne({ _id: idUser }, (err, userFind) => {
    if (err) return res.status(500).send({ mensaje: 'Error al solicitar usuario' })
    if (userFind) {
      return res.status(200).send({ userFind })
    } else {
      return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
    }
  })
}


module.exports = {
  mainStart,
  register,
  addAdmin,
  login,
  listProfile,
  listUsers,
  updateProfile,
  updateUsers,
  deleteProfile,
  deleteUsers,
  findUserId
}
