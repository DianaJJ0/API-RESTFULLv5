const express = require('express');
const router = express.Router();
const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios.controller.js');

// --- RUTAS CRUD DE LA API DE USUARIOS ---

// GET /api/usuarios/
router.get('/', obtenerUsuarios);

// POST /api/usuarios/
router.post('/', crearUsuario);

// PUT /api/usuarios/:email
router.put('/:email', actualizarUsuario);

// DELETE /api/usuarios/:email
router.delete('/:email', eliminarUsuario);

module.exports = router;