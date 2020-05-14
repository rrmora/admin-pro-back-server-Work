// Rutas -> crear rutas
var express = require('express');
// importar middleware jwt
var mdAuth = require('../middlewares/auth');
var app = express();

var ClienteVianey = require('../models/clienteVianey');

app.get('/test', mdAuth.verificarToken, (request, response, next) => {
    var result = request.query;
    response.status(200).send({
        ok: false,
        mensaje: 'Todo se carga bien',
        respuesta: result
    })
})

app.get('/', mdAuth.verificarToken, (request, response, next) => {
    // variables para paginar
    ClienteVianey.find({})
        .populate('')
        // .skip(desde)
        // .limit(5)
        .exec(
            (error, clientevianey) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar cliente',
                        errors: error
                    });
                }
                ClienteVianey.count({}, (error, conteo) => {
                    response.status(200).send({
                        ok: true,
                        clientes: clientevianey,
                        totalcliente: conteo
                    });
                });
            });
});



    // ====================================
    // Guardar cliente
    // ====================================
    app.post('/', mdAuth.verificarToken, (request, response) => {
        var body = request.body;
        // var obj = JSON.parse(body.data);
        console.log(body);
        var clienteVianey = new ClienteVianey({
           data: body    
         });
        // ====================================
        // Salvar cliente
        // ====================================
        clienteVianey.save((error, clienteGuardado) => {
            if (error) {
                response.status(400).send({
                    ok: false,
                    mensaje: 'Error al cargar clientes',
                    errors: error
                });
            }
    
            response.status(201).send({
                ok: true,
                cliente: clienteGuardado
            }); 
        });
    });


// ====================================
// Exportar ruta
// ====================================
module.exports = app;