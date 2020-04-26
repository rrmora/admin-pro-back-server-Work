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
            apellidoM: { type: String, required: false },
            correo: { type: String, required: false },
            telefono: { type: String, required: false },
            fechaNacimiento: { type: Date, required: false },
            estatus: { type: Number, required: false },
            noPasaporte: { type: String, required: false },
            fechaCitaPasaporte: { type: Date, required: false },
            ds160: { type: String, required: false },
            estatusVisa: { type: Number, required: false },
            fechaCitaVisa: { type: Date, required: false },
            createdAt: { type: Date, required: true },
            updatedAt: { type: Date, required: false }
        },
        children: [{
            data: {
                nombre: { type: String, required: [true, 'El nombre es requerido']},
                apellidoP: { type: String, required : [true, 'El apellido es requerido']},
                apellidoM: { type: String, required: false },
                correo: { type: String, required: false },
                telefono: { type: String, required: false },
                fechaNacimiento: { type: Date, required: false },
                estatus: { type: Number, required: false },
                noPasaporte: { type: String, required: false },
                fechaCitaPasaporte: { type: Date, required: false },
                ds160: { type: String, required: false },
                estatusVisa: { type: Number, required: false },
                fechaCitaVisa: { type: Date, required: false },
                createdAt: { type: Date, required: true },
                updatedAt: { type: Date, required: false }
            }
        }]
    }
    // children: { type: userDetail, required: false }
});

module.exports = mongoose.model('cliente', cliente);