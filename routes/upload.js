// Rutas -> crear rutas
var express = require('express');
var fileupload = require('express-fileupload');
var fs = require('fs');

var app = express();
// middleware
app.use(fileupload());
// modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


app.put('/:tipo/:id', (request, response, next) => {
    var tipo = request.params.tipo;
    var id = request.params.id;
    // validar tipo
    var tiposValidos = ['usuarios', 'medicos', 'hospitales'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return response.status(400).send({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            errors: { message: 'Tipo de colección no valida' }
        })
    }

    if (!request.files) {
        return response.status(400).send({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar un archivo' }
        });
    }
    // obtener nombre de archivo
    var archivo = request.files.imagen;
    var nombreExte = archivo.name.split('.');
    var extensionArchivo = nombreExte[nombreExte.length - 1];
    extensionArchivo;
    // validar extensiones
    var extensionesValidas = ['png', 'PNG', 'jpg', 'txt', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return response.status(400).send({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validad son: ' + extensionesValidas.join(', ') }
        });
    }
    // nombre de archivo personalizado
    var nombreArchivo = `${id} - ${ new Date().getMilliseconds()}.${extensionArchivo}`;
    // mover el archivo a una carpeta
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, error => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al mover el archivo',
                error: error
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, response);
        // response.status(200).send({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extension: extensionArchivo
        // });
    });

});

function subirPorTipo(tipo, id, nombreArchivo, response) {
    if (tipo === 'usuarios') {
        var msj = 'Imagen agregada correctamente';
        Usuario.findById(id, (error, usuario) => {
            if (!usuario) {
                return response.status(200).send({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    error: 'Usuario no existe'
                });
            }
            var oldPath = './uploads/usuarios/' + usuario.img;
            // eliminar path viejo si existe
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                msj = 'Imagen actualizada correctamente';
            }
            usuario.img = nombreArchivo;
            usuario.save((error, usuarioActulaizado) => {
                usuarioActulaizado.password = '****';
                return response.status(200).send({
                    ok: true,
                    mensaje: msj,
                    usuario: usuarioActulaizado
                });
            })
        });
    }
    if (tipo === 'medicos') {
        var msj = 'Imagen agregada correctamente';
        Medico.findById(id, (error, medico) => {
            if (!medico) {
                return response.status(200).send({
                    ok: true,
                    mensaje: 'Médico no existe',
                    error: 'Médico no existe'
                });
            }
            var oldPath = './uploads/medicos/' + medico.img;
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                msj = 'Imagen actualizada correctamente';
            }
            medico.img = nombreArchivo;
            medico.save((error, medicoActualizado) => {
                return response.status(200).send({
                    ok: true,
                    mensaje: msj,
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        var msj = 'Imagen agregada correctamente';
        Hospital.findById(id, (error, hospital) => {
            if (!hospital) {
                return response.status(200).send({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    error: 'Hospital no existe'
                });
            }
            var oldPath = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                msj = 'Imagen actualizada correctamente';
            }
            hospital.img = nombreArchivo;
            hospital.save((error, hospitalActualizado) => {
                return response.status(200).send({
                    ok: true,
                    mensaje: msj,
                    hospital: hospitalActualizado
                });
            });
        });
    }
}


// Exportar rutas
module.exports = app;