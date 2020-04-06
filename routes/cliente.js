// Rutas -> crear rutas
var express = require('express');
// importar middleware jwt
var mdAuth = require('../middlewares/auth');
var app = express();

var Cliente = require('../models/cliente');

app.get('/', (request, response, next) => {
    // variables para paginar
    var desde = request.query.desde || 0;
    desde = Number(desde)

    Cliente.find({})
        .populate('')
        .skip(desde)
        .limit(5)
        .exec(
            (error, cliente) => {
                if (error) {
                    response.status(500).send({
                        ok: false,
                        mensaje: 'Error al cargar cliente',
                        errors: error
                    });
                }
                Cliente.count({}, (error, conteo) => {
                    response.status(200).send({
                        ok: true,
                        clientes: cliente,
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
    var obj = JSON.parse(body.data);
    var cliente = new Cliente({
       data: obj    
    });

    // ====================================
    // Salvar cliente
    // ====================================
    cliente.save((error, clienteGuardado) => {
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
    // response.status(201).send({
    //     ok: true,
    //     cliente: cliente
    // });
});

// ====================================
// Actualizar cliente
// ====================================
app.put('/:id', mdAuth.verificarToken, (request, response) => {
    var id = request.params.id;
    var body = request.body;
    var client = JSON.parse(body.data);
    Cliente.findById(id, (error, clienteDB) => {
        if (error) {
            return response.status(500).send({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: error
            });
        }
        if (!clienteDB) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe.',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }
        // pasar obj a editar.
        clienteDB.data = client;

            // ====================================
            // Salvar
            // ====================================
            clienteDB.save((error, clienteActualizado) => {
            if (error) {
                return response.status(400).send({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: error
                });
            }
            response.status(200).send({
                ok: true,
                cliente: clienteActualizado
            });
        });
    });
})
// ====================================
// Borrar cliente
// ====================================

app.delete('/:id', mdAuth.verificarToken, (request, response) => {
    var id = request.params.id;

    Cliente.findByIdAndRemove(id, (error, clienteBorrado) => {
        if (error) {
            return response.status(400).send({
                ok: false,
                mensaje: 'Error al borrar cliente',
                errors: error
            });
        }
        if (!clienteBorrado) {
            return response.status(400).send({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe.',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }
        response.status(200).send({
            ok: true,
            cliente: clienteBorrado
        });
    });
})


// ====================================
// Exportar ruta
// ====================================
module.exports = app;











// app.put('/:id', mdAuth.verificarToken, (request, response) => {
//     var id = request.params.id;
//     var body = request.body;
//     var client = JSON.parse(body.data);
//     Cliente.findById(id, (error, clienteDB) => {
//         if (error) {
//             return response.status(500).send({
//                 ok: false,
//                 mensaje: 'Error al buscar cliente',
//                 errors: error
//             });
//         }
//         if (!clienteDB) {
//             return response.status(400).send({
//                 ok: false,
//                 mensaje: 'El cliente con el id ' + id + ' no existe.',
//                 errors: { message: 'No existe un cliente con ese ID' }
//             });
//         }

//         // cliente.nombre = body.nombre,
//         // cliente.usuario = request.usuario._id
//         // clienteDB.tieneHijos = body.tieneHijos;
//         clienteDB.data = client;

//         // response.status(200).send({
//         //     ok: true,
//         //     cliente: clienteDB
//         // });
 
//             // ====================================
//             // Actualizar
//             // ====================================
//             clienteDB.save((error, clienteActualizado) => {
//             if (error) {
//                 return response.status(400).send({
//                     ok: false,
//                     mensaje: 'Error al actualizar cliente',
//                     errors: error
//                 });
//             }
//             response.status(200).send({
//                 ok: true,
//                 cliente: clienteActualizado
//             });
//         });
//     });

// }); 

// module.exports = app;