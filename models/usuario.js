var mongoose = require('mongoose');
// plugin de validación de correo
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// Roles
var rolesValidos = {
    values: ['admin', 'user'],
    message: '{VALUE} no es un rol valido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es requerido'] },
    password: { type: String, required: [true, 'la contraseña es requerida'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'admin', enum: rolesValidos },
    google: { type: Boolean, default: false }
});
// agregar mensaje al correo
usuarioSchema.plugin(uniqueValidator, { messaje: '{PATH} debe de ser único' })
module.exports = mongoose.model('Usuario', usuarioSchema);