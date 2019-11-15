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