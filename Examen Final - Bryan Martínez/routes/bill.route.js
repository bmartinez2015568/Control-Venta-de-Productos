'use strict'

'use strict'

var express = require('express');
var billController = require('../controllers/bill.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveBill/:idA', mdAuth.ensureAuthAdmin, billController.saveBill);
api.get('/listBills/:idA', mdAuth.ensureAuthAdmin, billController.listBills);
api.get('/createBillClient/:idC', mdAuth.ensureAuthClient, billController.createBillClient);

module.exports = api;