'use strict'

var express = require('express');
var categoryController = require('../controllers/category.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveCategory/:idU', mdAuth.ensureAuthAdmin, categoryController.saveCategory);
api.get('/listCategories/:idU', mdAuth.ensureAuth, categoryController.listCategories);
api.put('/updateCategory/:idU/:idC', mdAuth.ensureAuthAdmin, categoryController.updateCategory);
api.delete('/removeCategory/:idU/:idC', mdAuth.ensureAuthAdmin, categoryController.removeCategory);

module.exports = api;
