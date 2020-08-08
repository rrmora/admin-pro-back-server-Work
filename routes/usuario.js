// Rutas -> crear rutas
var express = require('express');
// libreria para encriptar contraseña: -- una sola via --
var bcryp = require('bcryptjs');
// importar jwt
var jwt = require('jsonwebtoken');
// importar middleware jwt
var mdAuth = require('../middlewares/auth');
var app = express();


var Usuario = require('../models/usuario');

// ====================================
// Obtener usuarios
// ====================================
app.get('/', (request, response, next) => {
    // variables para paginar
    var desde = request.query.desde || 0;
    desde = Number(desde)

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(
            (error, usuarios) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: error
                    });
                }
                Usuario.count({}, (error, count) => {
                    response.status(200).send({
                        ok: true,
                        usuarios: usuarios,
                        totalUsuarios: count
                    });
                });
            });
});


// ====================================
// Actualizar usuario
// ====================================
app.put('/:id', [mdAuth.verificarToken, mdAuth.verificarRole, mdAuth.verificarUsuarioOAdmin], (request, response) => {
    var id = request.params.id;
    var body = request.body;
    Usuario.findById(id, (error, usuario) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: error
            });
        }
        if (!usuario) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre,
            usuario.email = body.email,
            usuario.role = body.role
            // ====================================
            // Actualizar
            // ====================================
        usuario.save((error, usuarioGuardado) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                });
            }
            usuarioGuardado.password = '***';
            response.status(200).send({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });

});


// ====================================
// Agregar usuario
// ====================================
// app.post('/', mdAuth.verificarToken, (request, response) => {
app.post('/', (request, response) => {
    var body = request.body;
    // asignar valores de usuario
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcryp.hashSync(body.password, 10),
        img: body.img,
        role: validarSuperAdmin(body.email)
    });
    console.log('BODY:', usuario);
    // ====================================
    // Guardar usuario
    // ====================================
    usuario.save((error, usuarioActualizado) => {
        if (error) {
            response.status(400).send({
                ok: false,
                mensaje: 'Error al cargar usuarios',
                errors: error
            });
        }

        response.status(201).send({
            ok: true,
            usuario: usuarioActualizado,
            usuarioToken: request.usuario
        });
    });

});


// ====================================
// Borrar usuario
// ====================================

app.delete('/:id', [mdAuth.verificarToken, mdAuth.verificarRole], (request, response) => {
    var id = request.params.id;

    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
        if (error) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: error
            });
        }
        if (!usuarioBorrado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe.',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        response.status(200).send({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})


function validarSuperAdmin(user) {
    if (user === 'raul.remo02@gmail.com') {
        return 'SUPER_ADMIN';
    }
    return 'USER_ROLE';
}
// ====================================
// Exportar ruta
// ====================================
module.exports = app;