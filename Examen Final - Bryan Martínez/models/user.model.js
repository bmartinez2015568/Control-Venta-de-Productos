'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    username: String,
    phone: Number,
    email: String,
    password: String,
    role: String,
    shoppingCart: [{
        name: String,
        stock: Number,
        price: Number,
        subTotal: Number
    }]
})

module.exports = mongoose.model('user', userSchema);