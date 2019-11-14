// Requires
var express = require('express');
var mongoose = require('mongoose');

// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error, response) => {
    if (error) {
        throw error;
    }
    console.log('Base de datos: \x1b[32m%s\x1b[0m', '-- Online --');
});

// inicializar valiables
var app = express();

// Rutas -> crear rutas
app.get('/', (request, response, next) => {
    response.status(200).send({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// escuchar peticiones
app.listen(3001, () => {
    console.log('Express server corriendo en el puerto 3001: \x1b[32m%s\x1b[0m', '-- Online --');
})