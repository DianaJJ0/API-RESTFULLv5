const { Router } = require('express');
const authController = require('../controllers/auth.controller');

// Creamos una nueva instancia del router de Express
const router = Router();

// --- Definición de Rutas de Autenticación ---

// Ruta para PROCESAR el formulario de registro (POST)
router.post('/register', authController.register_post);

// Ruta para PROCESAR el formulario de login (POST)
router.post('/login', authController.login_post);

// Ruta para CERRAR la sesión del usuario (GET)
router.get('/logout', authController.logout_get);

module.exports = router;