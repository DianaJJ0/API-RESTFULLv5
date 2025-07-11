const express = require('express');
const router = express.Router();

const { protegerRuta } = require('../middleware/auth.middleware.js');  
const { realizarCompra, obtenerPerfil } = require('../controllers/compra.controller.js');  

// Ruta para procesar la compra de un producto.
// ESTÁ PROTEGIDA: Solo usuarios logueados pueden acceder.
router.post('/comprar/:productoId', protegerRuta, realizarCompra);

// ========================================
//      NUEVA RUTA: Obtener perfil
// ========================================
// GET /v2/api/usuarios/perfil
// Devuelve el perfil del usuario autenticado.
// Esta ruta también debe estar protegida.
router.get('/usuarios/perfil', protegerRuta, obtenerPerfil);

module.exports = router;