var mongoose = require('mongoose');
// plugin de validación de correo
var uniqueValidator = require('mongoose-unique-validator');

var userDetail = require('../models/usuarioDetalle');

var Schema = mongoose.Schema;

var cliente = new Schema({
    tieneHijos: { type: Boolean, required: false },
    data: {
        data: {
            nombre: { type: String, required: [true, 'El nombre es requerido']},
            apellidoP: { type: String, required : [true, 'El apellido es requerido']},
            apellidoM: { type: String, required: false}
        },
        children: [{
            data: {
                nombre: { type: String, required: [true, 'El nombre es requerido']},
                apellidoP: { type: String, required : [true, 'El apellido es requerido']},
                apellidoM: { type: String, required: false}
            }
        }]
    }
    // children: { type: userDetail, required: false }
});

module.exports = mongoose.model('cliente', cliente);