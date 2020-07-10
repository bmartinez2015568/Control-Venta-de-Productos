'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shoppingCartSchema = Schema({
    name: String,
    stock: Number,
    price: Number,
    subTotal: Number
});

module.exports = mongoose.model('shoppingCart', shoppingCartSchema);
 