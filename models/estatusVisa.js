var mongoose = require('mongoose');
// plugin de validación de correo
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var estatusVisa = new Schema({
    nombre: { type: String, required: true }
})

module.exports = mongoose.model('estatusVisa', estatusVisa);