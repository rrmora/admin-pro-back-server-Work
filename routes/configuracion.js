// Rutas -> crear rutas
var express = require('express');
// libreria para encriptar contraseña: -- una sola via --
var bcryp = require('bcryptjs');
// importar jwt
var jwt = require('jsonwebtoken');
// importar middleware jwt
var mdAuth = require('../middlewares/auth');
var app = express();


var EstatusGeneral = require('../models/estatusGeneral');
var EstatusVisa = require('../models/estatusVisa');
var Consulado = require('../models/consulado');
var Precio = require('../models/precio');

// ====================================
// Obtener Estatus General
// ====================================
app.get('/estatusGeneral/', (request, response, next) => {
    // variables para paginar

    EstatusGeneral.find({})
        .exec(
            (error, estatusGeneral) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: error
                    });
                }
                response.status(200).send({
                    ok: true,
                    estatusGeneral: estatusGeneral
                });
            });
});


// ====================================
// Actualizar Estatus general
// ====================================
app.put('/estatusGeneral/:id', [mdAuth.verificarToken, mdAuth.verificarRole, mdAuth.verificarUsuarioOAdmin], (request, response) => {
    var id = request.params.id;
    var body = request.body;
    EstatusGeneral.findById(id, (error, estatusGeneral) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar estatus',
                errors: error
            });
        }
        if (!estatusGeneral) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El estatus con el id ' + id + ' no existe.',
                errors: { message: 'No existe un estatus con ese ID' }
            });
        }

        estatusGeneral.nombre = body.nombre,
        estatusGeneral.color = body.color,
        estatusGeneral.abre = body.abre,
            // ====================================
            // Actualizar
            // ====================================
            estatusGeneral.save((error, estatusGeneral) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar Estatus',
                    errors: error
                });
            }
            response.status(200).send({
                ok: true,
                estatusGeneral: estatusGeneral
            });
        });
    });    
});


// ====================================
// Agregar Estatus General
// ====================================
// app.post('/', mdAuth.verificarToken, (request, response) => {
app.post('/estatusGeneral/', (request, response) => {
    var body = request.body;
    // asignar valores de usuario
    var estatusGeneral = new EstatusGeneral({
        nombre: body.nombre,
        color: body.color,
        abre: body.abre
    });
    
    // ====================================
    // Guardar Estatus
    // ====================================
    estatusGeneral.save((error, estatusActualizado) => {
        if (error) {
            response.status(400).send({
                ok: false,
                mensaje: 'Error al cargar Estatus',
                errors: error
            });
        }

        response.status(201).send({
            ok: true,
            estatusActualizado: estatusActualizado
        });
    });
});

// ====================================
// Borrar Estatus General
// ====================================

app.delete('/estatusGeneral/:id', [mdAuth.verificarToken, mdAuth.verificarRole], (request, response) => {
    var id = request.params.id;

    EstatusGeneral.findByIdAndRemove(id, (error, estatusBorrado) => {
        if (error) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Error al borrar Estatus',
                errors: error
            });
        }
        if (!estatusBorrado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El Estatus con el id ' + id + ' no existe.',
                errors: { message: 'No existe un Estatus con ese ID' }
            });
        }
        response.status(200).send({
            ok: true,
            estatusGeneral: estatusBorrado
        });
    });
})

/////////////////////// Estatus Visa \\\\\\\\\\\\\\\\\\\\\\\\

// ====================================
// Obtener Estatus Visa
// ====================================
app.get('/estatusvisa/', (request, response, next) => {
    // variables para paginar

    EstatusVisa.find({})
        .exec(
            (error, estatusvisa) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar estatus',
                        errors: error
                    });
                }
                response.status(200).send({
                    ok: true,
                    estatusvisa: estatusvisa
                });
            });
});

// ====================================
// Actualizar Estatus Visa
// ====================================
app.put('/estatusVisa/:id', [mdAuth.verificarToken, mdAuth.verificarRole, mdAuth.verificarUsuarioOAdmin], (request, response) => {
    var id = request.params.id;
    var body = request.body;
    EstatusVisa.findById(id, (error, estatusVisa) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar estatus',
                errors: error
            });
        }
        if (!estatusVisa) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El estatus con el id ' + id + ' no existe.',
                errors: { message: 'No existe un estatus con ese ID' }
            });
        }

        estatusVisa.nombre = body.nombre,
        estatusVisa.abre = body.abre,
        estatusVisa.color = body.color,
            // ====================================
            // Actualizar
            // ====================================
            estatusVisa.save((error, EstatusGuardado) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar Estatus',
                    errors: error
                });
            }
            response.status(200).send({
                ok: true,
                estatusVisa: estatusVisa
            });
        });
    });    
});


// ====================================
// Agregar Estatus Visa
// ====================================
// app.post('/', mdAuth.verificarToken, (request, response) => {
    app.post('/estatusVisa/', (request, response) => {
        var body = request.body;
        // asignar valores de usuario
        var estatusVisa = new EstatusVisa({
            nombre: body.nombre,
            abre: body.abre,
            color: body.color
        });
        
        // ====================================
        // Guardar Estatus
        // ====================================
        estatusVisa.save((error, estatusActualizado) => {
            if (error) {
                response.status(400).send({
                    ok: false,
                    mensaje: 'Error al cargar Estatus',
                    errors: error
                });
            }
    
            response.status(201).send({
                ok: true,
                estatusActualizado: estatusActualizado
            });
        });
    });


// ====================================
// Borrar Estatus Visa
// ====================================

app.delete('/estatusVisa/:id', [mdAuth.verificarToken, mdAuth.verificarRole], (request, response) => {
    var id = request.params.id;

    EstatusVisa.findByIdAndRemove(id, (error, estatusBorrado) => {
        if (error) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Error al borrar Estatus',
                errors: error
            });
        }
        if (!estatusBorrado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El Estatus con el id ' + id + ' no existe.',
                errors: { message: 'No existe un Estatus con ese ID' }
            });
        }
        response.status(200).send({
            ok: true,
            estatusGeneral: estatusBorrado
        });
    });
})


/////////////////// Consulado \\\\\\\\\\\\\\\\\\\\\\
// ====================================
// Obtener Consulados
// ====================================
app.get('/consulado/', (request, response, next) => {
    // variables para paginar

    Consulado.find({})
        .exec(
            (error, consulados) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar consulado',
                        errors: error
                    });
                }
                response.status(200).send({
                    ok: true,
                    consulados: consulados
                });
            });
});


// ====================================
// Actualizar Consulado
// ====================================
app.put('/consulado/:id', [mdAuth.verificarToken, mdAuth.verificarRole, mdAuth.verificarUsuarioOAdmin], (request, response) => {
    var id = request.params.id;
    var body = request.body;
    Consulado.findById(id, (error, consulado) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar consulado',
                errors: error
            });
        }
        if (!consulado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El consulado con el id ' + id + ' no existe.',
                errors: { message: 'No existe un consulado con ese ID' }
            });
        }

        consulado.nombre = body.nombre,
            // ====================================
            // Actualizar
            // ====================================
            consulado.save((error, consuladoGuardado) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar consulado',
                    errors: error
                });
            }
            response.status(200).send({
                ok: true,
                consulado: consulado
            });
        });
    });    
});

// ====================================
// Agregar consulado
// ====================================
// app.post('/', mdAuth.verificarToken, (request, response) => {
    app.post('/consulado/', (request, response) => {
        var body = request.body;
        // asignar valores de usuario
        var consulado = new Consulado({
            nombre: body.nombre
        });
        
        // ====================================
        // Guardar Consulado
        // ====================================
        consulado.save((error, consuladoActualizado) => {
            if (error) {
                response.status(400).send({
                    ok: false,
                    mensaje: 'Error al cargar Consulado',
                    errors: error
                });
            }
    
            response.status(201).send({
                ok: true,
                consuladoActualizado: consuladoActualizado
            });
        });
    });


    
// ====================================
// Borrar Consulado
// ====================================

app.delete('/consulado/:id', [mdAuth.verificarToken, mdAuth.verificarRole], (request, response) => {
    var id = request.params.id;

    Consulado.findByIdAndRemove(id, (error, consuladoBorrado) => {
        if (error) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Error al borrar consulado',
                errors: error
            });
        }
        if (!consuladoBorrado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El consulado con el id ' + id + ' no existe.',
                errors: { message: 'No existe un consulado con ese ID' }
            });
        }
        response.status(200).send({
            ok: true,
            consuladoBorrado: consuladoBorrado
        });
    });
})



/////////////////// Precio \\\\\\\\\\\\\\\\\\\\\\
// ====================================
// Obtener precio
// ====================================
app.get('/precio/', (request, response, next) => {
    // variables para paginar

    Precio.find({})
        .exec(
            (error, precio) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar precios',
                        errors: error
                    });
                }
                response.status(200).send({
                    ok: true,
                    precio: precio
                });
            });
});

// ====================================
// Actualizar precio
// ====================================
app.put('/precio/:id', [mdAuth.verificarToken, mdAuth.verificarRole, mdAuth.verificarUsuarioOAdmin], (request, response) => {
    var id = request.params.id;
    var body = request.body;
    Precio.findById(id, (error, precio) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar precio',
                errors: error
            });
        }
        if (!precio) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El precio con el id ' + id + ' no existe.',
                errors: { message: 'No existe un precio con ese ID' }
            });
        }

        precio.nombre = body.nombre,
            // ====================================
            // Actualizar
            // ====================================
            precio.save((error, precioGuardado) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar precio',
                    errors: error
                });
            }
            response.status(200).send({
                ok: true,
                precio: precio
            });
        });
    });    
});


// ====================================
// Agregar precio
// ====================================
// app.post('/', mdAuth.verificarToken, (request, response) => {
    app.post('/precio/', (request, response) => {
        var body = request.body;
        // asignar valores de usuario
        var precio = new Precio({
            nombre: body.nombre
        });
        
        // ====================================
        // Guardar precio
        // ====================================
        precio.save((error, precioActualizado) => {
            if (error) {
                response.status(400).send({
                    ok: false,
                    mensaje: 'Error al cargar precio',
                    errors: error
                });
            }
    
            response.status(201).send({
                ok: true,
                precioActualizado: precioActualizado
            });
        });
    });




// ====================================
// Exportar ruta
// ====================================
module.exports = app;
