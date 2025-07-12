const Usuario = require('../models/usuarios.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const maxAge = 3 * 24 * 60 * 60; // significa 3 días antes de que el token expire :)
// --- Crear un token JWT ---
// Esta función genera un token JWT con el ID del usuario y una clave secreta
// El token tiene una duración definida por maxAge
// Si no se define JWT_SECRET en el .env, usa un valor por defecto
// Esto es útil para autenticar al usuario en futuras solicitudes.

// El token se puede enviar al cliente y guardarse en una cookie o localStorage.
// El cliente puede enviar este token en el header Authorization para acceder a rutas protegidas
// El token se verifica en el middleware de autenticación para asegurar que el usuario está autenticado 
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'tu_secreto_por_defecto', {
        expiresIn: maxAge
    });
};

// ===================           FUNCIÓN DE REGISTRO (API)         =======================


// --- Procesar el registro de un nuevo usuario (API) ---

// Esta función recibe los datos del formulario de registro, valida y crea un nuevo usuario en la base de datos
// Utiliza bcrypt para hashear la contraseña antes de guardarla
// Si el registro es exitoso, envía una respuesta con el usuario creado y un mensaje
const register_post = async (req, res) => {
    const { nombreCompleto, correo, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = await Usuario.create({ 
            nombreCompleto, 
            correo, 
            password: hashedPassword 
        });

        res.status(201).json({ mensaje: "Usuario registrado con éxito.", usuario });
    } catch (error) {
        // --- Captura de errores claros y detallados ---
        let mensaje = 'No se pudo completar el registro. Verifique sus datos.';

        // Error de email duplicado (MongoError: E11000)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.correo) {
            mensaje = 'El correo ya está registrado. Usa otro correo.';
        }
        // Error de validación de Mongoose
        else if (error.name === 'ValidationError') {
            mensaje = Object.values(error.errors).map(err => err.message).join(' ');
        }
        // Otros errores de Mongoose
        else if (error.message) {
            mensaje = error.message;
        }

        // Imprime el error con detalles en la terminal
        console.error("Error en el registro:", mensaje, error);

        // Envía el mensaje real al frontend
        res.status(400).json({ mensaje });
    }
}

// --- Procesar el inicio de sesión (API) ---


// Esta función recibe los datos del formulario de inicio de sesión, valida las credenciales y genera un token JWT
// Si las credenciales son correctas, envía una respuesta con el token y el usuario
// Si las credenciales son incorrectas, envía un mensaje de error
// El token se puede guardar en una cookie o localStorage para futuras solicitudes
const login_post = async (req, res) => { 
    const { correo, password } = req.body; 

    try {
        const usuario = await Usuario.findOne({ correo }); 
        if (usuario) {
            const auth = await bcrypt.compare(password, usuario.password); 
            if (auth) {
                const token = createToken(usuario._id);
                
                // --- Guardar el token en una cookie ---
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });  
                res.status(200).json({ mensaje: "Login exitoso", token, usuario });
            } else {
                res.status(400).json({ error: 'Contraseña incorrecta.' });
            }
        } else {
            res.status(400).json({ error: 'Este correo no está registrado.' });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
    }
}


// --- Cerrar sesión (API) ---


// Esta función elimina el token JWT de la cookie del cliente, cerrando la sesión del usuario
// Envía una respuesta confirmando que la sesión se cerró correctamente
const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ mensaje: "Sesión cerrada correctamente." });
}

module.exports = {
    register_post,
    login_post,
    logout_get
};