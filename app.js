// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error, response) => {
    if (error) {
        throw error;
    }
    console.log('Base de datos: \x1b[32m%s\x1b[0m', '-- Online --');
});

// inicializar valiables
var app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// llamado a rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// middleware
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3001, () => {
    console.log('Express server corriendo en el puerto 3001: \x1b[32m%s\x1b[0m', '-- Online --');
})