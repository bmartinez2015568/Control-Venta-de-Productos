'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = Schema({
    name: String
});

module.exports = mongoose.model('category', categorySchema);
