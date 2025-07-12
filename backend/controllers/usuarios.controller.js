const modeloUsuario = require('../models/usuarios.model');
const bcrypt = require('bcryptjs'); // Importante! Se usa para encriptar las contraseñas.


/*GET - Obtener todos los usuarios.*/

// Esta función obtiene todos los usuarios de la base de datos
// Excluye el campo de la contraseña para no exponerlo en la respuesta
const obtenerUsuarios = async (req, res) => {
    try {
        // El segundo argumento de find ('-password') excluye el campo de la contraseña de los resultados.
        const listaUsuarios = await modeloUsuario.find({}, '-password');
        res.status(200).json(listaUsuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al obtener usuarios." });
    }
};
/*POST - Crear un nuevo usuario (Registro).*/

// Esta función crea un nuevo usuario en la base de datos
// Asegúrate de que el cuerpo de la solicitud contenga todos los campos necesarios
const crearUsuario = async (req, res) => {
    try {
        const {nombreCompleto, fechaNacimiento, correo, password, rol } = req.body;

        // 1. Validar que la contraseña exista
        if (!password) {
            return res.status(400).json({ mensaje: "El campo 'password' es obligatorio." });
        }

        // 2. Encriptar la contraseña
        // bcrypt.hash es una función que encripta la contraseña usando un algoritmo de hash seguro
        // 'salt' es un valor aleatorio que se usa para hacer el hash más seguro

        const salt = await bcrypt.genSalt(10); 
        const passwordEncriptada = await bcrypt.hash(password, salt); // Crea el hash


        // 3. Crear el usuario con la contraseña encriptada

        // Se usa el modelo 'modeloUsuario' para crear un nuevo usuario en la base de datos
        // Se guarda el nombre completo, fecha de nacimiento, correo y rol (opcional)                                                                                                                                                                                                                               
        const usuarioGuardado = await modeloUsuario.create({
            nombreCompleto,
            fechaNacimiento,
            correo,
            password: passwordEncriptada, // Se guarda la contraseña encriptada usando bcrypt.hash (buenisimo)
            rol // Se puede asignar un rol (ej. 'user', 'admin')
        });

        // 4. Crear una copia del usuario para la respuesta, sin la contraseña

        // Se convierte el usuario guardado a un objeto y se elimina el campo de la contraseña
        // Esto es importante para no exponer la contraseña en la respuesta al cliente
        const usuarioParaRespuesta = usuarioGuardado.toObject();
        delete usuarioParaRespuesta.password;

        res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario: usuarioParaRespuesta });

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        // Si el error es por un campo duplicado (ej. email ya existe)
        if (error.code === 11000) {
            return res.status(409).json({ mensaje: "Error al crear el usuario: el correo ya está registrado." });
        }
        res.status(400).json({ mensaje: "Error al crear el usuario.", error: error.message });
    }
};

//-------------------------------------------------
/*PUT - Actualizar un usuario existente.
 * NOTA: Este endpoint no debería usarse para cambiar la contraseña.*/

// Esta función actualiza un usuario existente en la base de datos
// Asegúrate de que el cuerpo de la solicitud contenga los campos necesarios
const actualizarUsuario = async (req, res) => {
    try {
        // Se elimina el campo 'password' del cuerpo de la solicitud para evitar que se actualice aquí.
        // La actualización de contraseña debería tener su propio endpoint y lógica de seguridad....
        delete req.body.password;

        const usuarioActualizado = await modeloUsuario.findOneAndUpdate(
            { correo: req.params.email },
            req.body,
            { new: true, runValidators: true }
        ).select('-password'); // Excluye la contraseña de la respuesta

        if (usuarioActualizado) {
            res.status(200).json({ mensaje: "Usuario actualizado exitosamente", usuario: usuarioActualizado });
        } else {
            res.status(404).json({ mensaje: `No se encontró el usuario con correo '${req.params.email}'` });
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(400).json({ mensaje: "Error al actualizar el usuario.", error: error.message });
    }
};

// -------------------------------------------------
/*DELETE - Eliminar un usuario.*/

// Esta función elimina un usuario de la base de datos usando su correo
// Si el usuario es encontrado y eliminado, devuelve un mensaje de éxito                                                
const eliminarUsuario = async (req, res) => { 
    try {
        const usuarioEliminado = await modeloUsuario.findOneAndDelete({ correo: req.params.email });
        if (usuarioEliminado) {
            res.status(200).json({ mensaje: "Usuario eliminado exitosamente" });
        } else {
            res.status(404).json({ mensaje: `No se encontró el usuario con correo '${req.params.email}'` });
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ mensaje: "Error al eliminar el usuario." });
    }
};


module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario 
};