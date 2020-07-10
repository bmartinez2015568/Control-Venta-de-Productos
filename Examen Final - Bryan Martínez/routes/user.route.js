'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);

//FUNCIONES CON ROLE ADMIN
api.put('/updateClient/:idA/:idC', mdAuth.ensureAuthAdmin, userController.updateClient);
api.delete('/removeClient/:idA/:idC', mdAuth.ensureAuthAdmin, userController.removeClient);
api.get('/listUsers/:idA', mdAuth.ensureAuthAdmin, userController.listUsers);

//FUNCIONES DEL CLIENTE
api.post('/registerClient', userController.RegisterClient);
api.put('/updateUser/:idC', mdAuth.ensureAuthClient, userController.updateUser);
api.delete('/removeUser/:idC', mdAuth.ensureAuthClient, userController.removeUser);
api.post('/setProduct/:idC', mdAuth.ensureAuthClient, userController.setProduct);

module.exports = api;
