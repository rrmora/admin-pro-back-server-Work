// Rutas -> crear rutas
var express = require('express');
// importar middleware jwt
var mdAuth = require('../middlewares/auth');
var app = express();

var Hospital = require('../models/hospital');


// ====================================
// Obtener Hospitales
// ====================================

app.get('/', (request, response, next) => {
    // variables para paginar
    var desde = request.query.desde || 0;
    desde = Number(desde)

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (error, hospitales) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar Hospitales',
                        errors: error
                    });
                }
                Hospital.count({}, (error, conteo) => {
                    response.status(200).send({
                        ok: true,
                        hospitales: hospitales,
                        totalHospitales: conteo
                    });
                });
            });
});

// ====================================
// Actualizar hospital
// ====================================
app.put('/:id', mdAuth.verificarToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;
    Hospital.findById(id, (error, hospital) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: error
            });
        }
        if (!hospital) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El hospita con el id ' + id + ' no existe.',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre,
            hospital.usuario = request.usuario._id
            // ====================================
            // Actualizar
            // ====================================
        hospital.save((error, hospitalActualizado) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                });
            }
            response.status(200).send({
                ok: true,
                hospital: hospitalActualizado
            });
        });
    });

});





// // ====================================
// // Agregar hospital
// // ====================================

app.post('/', mdAuth.verificarToken, (request, response) => {
    var body = request.body;
    // asignar valores de hospital
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: request.usuario._id
    });
    // ====================================
    // Guardar usuario
    // ====================================
    hospital.save((error, hospitalGuardado) => {
        if (error) {
            response.status(400).send({
                ok: false,
                mensaje: 'Error al cargar hospitale',
                errors: error
            });
        }

        response.status(201).send({
            ok: true,
            hospital: hospitalGuardado
        });
    });

});

// ====================================
// Borrar hospital
// ====================================

app.delete('/:id', mdAuth.verificarToken, (request, response) => {
    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {
        if (error) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: error
            });
        }
        if (!hospitalBorrado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe.',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }
        response.status(200).send({
            ok: true,
            usuario: hospitalBorrado
        });
    });
})

// ====================================
// Exportar rutas
// ====================================

module.exports = app;