const modeloUsuario = require('../models/usuarios.model');
const bcrypt = require('bcryptjs'); // Importante! Se usa para encriptar las contraseñas.

/*GET - Obtener todos los usuarios.*/
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
const crearUsuario = async (req, res) => {
    try {
        const {nombreCompleto, fechaNacimiento, correo, password, rol } = req.body;

        // 1. Validar que la contraseña exista
        if (!password) {
            return res.status(400).json({ mensaje: "El campo 'password' es obligatorio." });
        }

        // 2. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10); // Genera una "sal" para el hash
        const passwordEncriptada = await bcrypt.hash(password, salt); // Crea el hash

        // 3. Crear el usuario con la contraseña encriptada
        const usuarioGuardado = await modeloUsuario.create({
            nombreCompleto,
            fechaNacimiento,
            correo,
            password: passwordEncriptada, // Se guarda la contraseña encriptada usando bcrypt.hash (buenisimo)
            rol // Se puede asignar un rol (ej. 'user', 'admin')
        });

        // 4. Crear una copia del usuario para la respuesta, sin la contraseña
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

/*PUT - Actualizar un usuario existente.
 * NOTA: Este endpoint no debería usarse para cambiar la contraseña.*/
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

/*DELETE - Eliminar un usuario.*/
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