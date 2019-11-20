// Rutas -> crear rutas
var express = require('express');
// libreria para encriptar contraseña: -- una sola via --
var bcryp = require('bcryptjs');
// libreria jswebtoken
var jwt = require('jsonwebtoken');
// importar SEED
var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;
// google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


var app = express();

var Usuario = require('../models/usuario');
// ====================================
// Autenticacion google
// ====================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(request, response) => {
    var token = request.body.token;
    var googleUser = await verify(token).catch(e => {
        return response.status(500).send({
            ok: false,
            mensaje: 'Token no valido'
        });
    });
    // verificar correo
    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Debe usar autenticación normal'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 horas
                response.status(200).send({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        } else {
            // el usuario no existe y se debe crear
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.password = '****';
            usuario.google = true;

            usuario.save((error, usuarioDB) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 horas
                response.status(200).send({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        }
    });
});

// ====================================
// Autenticacion normal
// ====================================
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