const express = require('express');
const router = express.Router();

const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios.controller.js');

// RUTAS CRUD DE LA API DE USUARIOS
router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
router.put('/:email', actualizarUsuario);
router.delete('/:email', eliminarUsuario);

// --- RUTA PARA OBTENER EL PERFIL DEL USUARIO AUTENTICADO ---
const { protegerRuta } = require('../middleware/auth.middleware.js');
const { obtenerPerfil } = require('../controllers/compra.controller.js');

// GET /v2/api/usuarios/perfil
router.get('/perfil', protegerRuta, obtenerPerfil);

module.exports = router;