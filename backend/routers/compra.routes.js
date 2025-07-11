const express = require('express');
const router = express.Router();

const { protegerRuta } = require('../middleware/auth.middleware.js');
const { realizarCompra } = require('../controllers/compra.controller.js');

// Ruta para procesar la compra de un producto
router.post('/comprar/:productoId', protegerRuta, realizarCompra);

module.exports = router;