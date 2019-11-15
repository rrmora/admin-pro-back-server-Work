// Rutas -> crear rutas
var express = require('express');
// libreria para encriptar contraseña: -- una sola via --
var bcryp = require('bcryptjs');
// libreria jswebtoken
var jwt = require('jsonwebtoken');
// importar SEED
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (request, response) => {
    var body = request.body;
    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: error
            });
        }
        if (!usuarioDB) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: error
            });
        }
        if (!bcryp.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: error
            });
        }
        // ====================================
        // crear Token
        // ====================================
        usuarioDB.password = '****';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 horas
        response.status(200).send({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});





// ====================================
// Exportar 
// ====================================

module.exports = app;