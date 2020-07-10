'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveProduct/:idU', mdAuth.ensureAuthAdmin, productController.saveProduct);
api.put('/updateProduct/:idU/:idP', mdAuth.ensureAuthAdmin, productController.updateProduct);
api.delete('/removeProduct/:idU/:idP', mdAuth.ensureAuthAdmin, productController.removeProduct);
api.get('/listProducts/:idU', mdAuth.ensureAuthAdmin, productController.listProducts);
api.get('/productsSoldOut/:idA', mdAuth.ensureAuthAdmin, productController.productsSoldOut);
api.get('/productSold/:idU', mdAuth.ensureAuth, productController.productSold);
api.post('/searchProductName/:idC', mdAuth.ensureAuthClient, productController.searchProductName);

module.exports = api;