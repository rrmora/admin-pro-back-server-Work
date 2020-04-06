// importar jwt
var jwt = require('jsonwebtoken');
// importar SEED
var SEED = require('../config/config').SEED;



// ====================================
// Verificar TOKEN
// ====================================
exports.verificarToken = function(request, response, next) {
    var token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(401).send({
                ok: false,
                mensaje: 'Token no valido.',
                errors: error
            });
        }
        // obtener usuario del objeto decoded
        request.usuario = decoded.usuario;
        next();
    });
}


// ====================================
// Verificar ROLE
// ====================================
exports.verificarRole = function(request, response, next) {
    var usuario = request.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return response.status(401).send({
            ok: false,
            mensaje: 'Token no valido.',
            errors: {message: 'El usuario no tiene permisos para actulizar un usuario'}
        });
    }
    
}


// ====================================
// Verificar ADMIN O USUARIO
// ====================================
exports.verificarUsuarioOAdmin = function(request, response, next) {
    var usuario = request.usuario;
    var id = request.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return response.status(401).send({
            ok: false,
            mensaje: 'Token no valido.',
            errors: {message: 'El usuario no tiene permisos para actulizar un usuario'}
        });
    }
    
}