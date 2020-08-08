// Rutas -> crear rutas
var express = require('express');
// importar middleware jwt
var mdAuth = require('../middlewares/auth');
var app = express();

var Medico = require('../models/medico');

// ====================================
// Obtener medico
// ====================================

app.get('/', (request, response, next) => {
    // variables para paginar
    var desde = request.query.desde || 0;
    desde = Number(desde)
    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (error, medicos) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar Médicos',
                        errors: error
                    });
                }
                response.status(200).send({
                    ok: true,
                    medicos: medicos,
                    totalMedicos: conteo
                });
            });
});

// ====================================
// Actualizar Medico
// ====================================
app.put('/:id', mdAuth.verificarToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;

    Medico.findById(id, (error, medico) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar médico',
                errors: error
            });
        }
        if (!medico) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El médico con el id ' + id + ' no existe.',
                errors: { message: 'No existe un médico con ese ID' }
            });
        }

        medico.nombre = body.nombre,
            medico.usuario = request.usuario._id,
            medico.hospital = body.hospital
            // ====================================
            // Actualizar
            // ====================================
        medico.save((error, medicoActualizado) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar médico',
                    errors: error
                });
            }
            response.status(200).send({
                ok: true,
                medico: medicoActualizado
            });
        });
    });

});





// // ====================================
// // Agregar medico
// // ====================================

app.post('/', mdAuth.verificarToken, (request, response) => {
    var body = request.body;
    // asignar valores de hospital
    var medico = new Medico({
        nombre: body.nombre,
        usuario: request.usuario._id,
        hospital: body.hospital
    });
    // ====================================
    // Guardar medico
    // ====================================
    medico.save((error, medicoGuardado) => {
        if (error) {
            response.status(400).send({
                ok: false,
                mensaje: 'Error al cargar médico',
                errors: error
            });
        }

        response.status(201).send({
            ok: true,
            medico: medicoGuardado
        });
    });

});

// ====================================
// Borrar medico
// ====================================

app.delete('/:id', mdAuth.verificarToken, (request, response) => {
    var id = request.params.id;

    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {
        if (error) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Error al borrar médico',
                errors: error
            });
        }
        if (!medicoBorrado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El médico con el id ' + id + ' no existe.',
                errors: { message: 'No existe un médico con ese ID' }
            });
        }
        response.status(200).send({
            ok: true,
            medico: medicoBorrado
        });
    });
})

// ====================================
// Exportar ruta
// ====================================

module.exports = app;