'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String,
    stock: Number,
    price: Number,
    sold: Number,
    category: [{type: Schema.Types.ObjectId, ref:'category'}]
});

module.exports = mongoose.model('product', productSchema);
 