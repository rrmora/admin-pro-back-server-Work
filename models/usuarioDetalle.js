var mongoose = require('mongoose');
// plugin de validación de correo
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioDetalle = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido']},
    apellidoP: { type: String, required : [true, 'El apellido es requerido']},
    apellidoM: { type: String, required: false}
});

module.exports = mongoose.model('UsuarioDetalle', usuarioDetalle);

