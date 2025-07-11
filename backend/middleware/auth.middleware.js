const jwt = require('jsonwebtoken'); 
// Middleware para proteger rutas y verificar autenticación
// Este middleware se encarga de verificar si el usuario está autenticado mediante un token JWT almacenado en una cookie.

// Si el token no es válido o ha expirado, se redirige al usuario a la página de login y se limpia la cookie del token.
// Si no hay token, se redirige al usuario a la página de login.

const Usuario = require('../models/usuarios.model');

// También se define una función para verificar al usuario en cada petición, lo que permite mostrar información del usuario en las vistas sin necesidad de volver a autenticarlo.
// Además, se utiliza un modelo de usuario para interactuar con la base de datos y obtener  los datos del usuario autenticado.

// --- Función para verificar al usuario en CADA petición ---
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt; // Obtenemos el token JWT de las cookies

    if (token) {
        // Verificamos el token JWT
 // Si el token es válido, decodificamos su contenido
// Si el token es válido, se busca al usuario en la base de datos y se añade a la petición (req) para que esté disponible en las siguientes funciones.

        // Si el token es inválido o ha expirado, se maneja el error y se establece res.locals.usuario como null.
        jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_por_defecto', async (err, decodificado) => {
            if (err) {
                // Si hay un error con el token (inválido, expirado), no hay usuario
                res.locals.usuario = null;
                next();
            } else {
                // Si el token es válido, buscamos al usuario y lo hacemos disponible en las vistas
                const usuario = await Usuario.findById(decodificado.id).select('-password');
                res.locals.usuario = usuario; // ¡Aquí está la magia!
                next();
            }
        });
    } else {
        // Si no hay token, simplemente no hay usuario
        res.locals.usuario = null;
        next();
    }
};


// --- Función para PROTEGER rutas (esta ya la tenías) ---
const protegerRuta = async (req, res, next) => {
    // ... (el código de esta función no cambia)
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_por_defecto');
        const usuario = await Usuario.findById(decodificado.id).select('-password');
        
        if (usuario) {
            req.usuario = usuario;
            return next();
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        return res.clearCookie('jwt').redirect('/login');
    }
};

// Exportamos ambas funciones
module.exports = {
    checkUser,
    protegerRuta
};