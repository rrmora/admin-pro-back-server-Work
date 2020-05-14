var mongoose = require('mongoose');
// plugin de validación de correo
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var clienteVianey = new Schema({
    data: {
        data: {
            nombre: { type: String, required: false },
            apellido: { type: String, required: false },
            tipoVenta: { type: Number, required: false },
            pedido: [
                {
                    claveProducto: { type: String, required: false },
                    nombreProducto: { type: String, required: false },
                    descripcion: { type: String, required: false },
                    cantidad: { type: Number, required: false },
                    precioProveedor: { type: Number, required: false },
                    precioCliente: { type: Number, required: false },
                    estatus: { type: String, required: false }
                }
            ]
        }
    }
})

module.exports = mongoose.model('clienteVianey', clienteVianey);