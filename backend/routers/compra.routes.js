const express = require('express');
const router = express.Router();

// Importamos el middleware de autenticación para proteger las rutas
const { protegerRuta } = require('../middleware/auth.middleware.js'); 

// Importamos el controlador de compras
// Este controlador maneja la lógica de negocio para procesar compras
const { realizarCompra } = require('../controllers/compra.controller.js');

// Ruta para procesar la compra de un producto
router.post('/comprar/:productoId', protegerRuta, realizarCompra);

module.exports = router;