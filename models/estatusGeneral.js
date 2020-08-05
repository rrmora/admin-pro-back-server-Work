var mongoose = require('mongoose');
// plugin de validación de correo
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var estatusGeneral = new Schema({
    nombre: { type: String, required: true },
    abre: { type: String, required: true },
    color: { type: String, require: false }
})

module.exports = mongoose.model('estatusGeneral', estatusGeneral);