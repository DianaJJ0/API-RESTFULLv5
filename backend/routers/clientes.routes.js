const express = require('express');
const router = express.Router();

const {
    obtenerClientes,
    obtenerClientePorUsuario, // Nuevo nombre de la función para buscar por usuario
    crearCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/clientes.controller.js');

// --- Rutas para la API de Clientes ---

// GET /v2/api/clientes/
// Devuelve todos los clientes
router.get('/', obtenerClientes);

// GET /v2/api/clientes/usuario/:usuarioId
// Busca un cliente por el id del usuario asociado
router.get('/usuario/:usuarioId', obtenerClientePorUsuario);

// POST /v2/api/clientes/
// Crea un nuevo cliente, espera: { usuario, telefono, direccion, ... } en el body
router.post('/', crearCliente);

// PUT /v2/api/clientes/usuario/:usuarioId
// Actualiza los datos de cliente por el id de usuario
router.put('/usuario/:usuarioId', actualizarCliente);

// DELETE /v2/api/clientes/usuario/:usuarioId
// Elimina un cliente por el id de usuario
router.delete('/usuario/:usuarioId', eliminarCliente);

module.exports = router;