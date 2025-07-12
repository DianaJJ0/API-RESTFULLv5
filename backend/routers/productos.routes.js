const express = require('express');
const router = express.Router();

// Importamos el controlador de productos
// Este controlador maneja la lógica de negocio para productos
const { 
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto } = require('../controllers/productos.controller.js'); 

// --- RUTAS DE LA API PARA PRODUCTOS ---

// GET /api/productos
router.get('/', obtenerProductos);

// GET /api/productos/:ref
router.get('/:ref', obtenerProducto);

// POST /api/productos
router.post('/', crearProducto);

// PUT /api/productos/:ref
router.put('/:ref', actualizarProducto);

// DELETE /api/productos/:ref
router.delete('/:ref', eliminarProducto);

module.exports = router;