'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = Schema({
    client: [{type: Schema.Types.ObjectId, ref:'user'}],
    date: Date,
    products: [{
        _id: String,
        name: String,
        stock: Number,
        price: Number,
        subTotal: Number
    }],
    total: Number
})

module.exports = mongoose.model('bill', billSchema);