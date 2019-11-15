// Rutas -> crear rutas
var express = require('express');

var app = express();

app.get('/', (request, response, next) => {
    response.status(200).send({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});
// Exportar rutas
module.exports = app;