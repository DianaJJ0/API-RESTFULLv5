const modeloCliente = require('../models/clientes.model');

/**
 * GET - Obtener todos los clientes.
 * Devuelve la lista de todos los clientes registrados.
 */
const obtenerClientes = async (req, res) => {
    try {
        // Busca todos los clientes y popula los datos del usuario asociado
        // Esto permite que cada cliente tenga acceso a los datos del usuario (nombre, correo, rol)
        // Se usa populate para incluir los datos del usuario en la respuesta.

        
        // 'modeloCliente' es el modelo de Mongoose para clientes
        // 'usuario' es el campo que referencia al modelo Usuario
        // 'nombreCompleto correo rol' son los campos que queremos mostrar del usuario
        // Esto es útil para mostrar información del cliente junto con su usuario
        const listaClientes = await modeloCliente.find().populate('usuario', 'nombreCompleto correo rol');
        res.status(200).json(listaClientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al obtener los clientes." });
    }
};

/**
 * GET - Obtener un cliente específico por el id del usuario.
 * Ejemplo de uso: /v2/api/clientes/usuario/:usuarioId
 */


// Esta función busca un cliente usando el id del usuario y devuelve sus datos
// Utiliza populate para incluir los datos del usuario asociado al cliente
const obtenerClientePorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        // Busca el cliente usando el id del usuario y popula los datos del usuario
        const cliente = await modeloCliente.findOne({ usuario: usuarioId }).populate('usuario', 'nombreCompleto correo rol');

        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ mensaje: `No se encontró ningún cliente asociado al usuario con id '${usuarioId}'` });
        }
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

/**
 * POST - Crear un nuevo cliente.
 * El body debe incluir: usuario (id), telefono, direccion, fechaNacimiento, ciudad, codigoPostal, etc.
 */

// Esta función crea un nuevo cliente en la base de datos
// Asegúrate de que el campo 'usuario' esté presente en el cuerpo de la solicitud
// El usuario debe ser un id válido de un usuario existente
const crearCliente = async (req, res) => {
    try {
        // Asegúrate que el campo usuario esté presente
        if (!req.body.usuario) {
            return res.status(400).json({ mensaje: "Falta el id del usuario en el cuerpo de la solicitud." });
        }
        // Crea el cliente con los datos extra
        const clienteGuardado = await modeloCliente.create(req.body);
        res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente: clienteGuardado });
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        res.status(400).json({ mensaje: "Error al crear el cliente. Verifique los datos.", error: error.message });
    }
};

/**
 * PUT - Actualizar la información de un cliente existente por el id de usuario.
 * Ejemplo de uso: /v2/api/clientes/usuario/:usuarioId
 */


// Esta función actualiza los datos de un cliente existente
// Utiliza el id del usuario para encontrar el cliente y actualizar sus datos
// Devuelve el cliente actualizado o un mensaje de error si no se encuentra
// Se usa 'runValidators: true' para validar los datos antes de guardar
const actualizarCliente = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        // Actualiza usando el id del usuario
        const clienteActualizado = await modeloCliente.findOneAndUpdate(
            { usuario: usuarioId },
            req.body,
            { new: true, runValidators: true }
        ).populate('usuario', 'nombreCompleto correo rol');

        if (clienteActualizado) {
            res.status(200).json({ mensaje: "Cliente actualizado exitosamente", cliente: clienteActualizado });
        } else {
            res.status(404).json({ mensaje: `No se encontró el cliente asociado al usuario con id '${usuarioId}' para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(400).json({ mensaje: "Error al actualizar el cliente.", error: error.message });
    }
};

/**
 * DELETE - Eliminar un cliente de la base de datos por el id de usuario.
 * Ejemplo de uso: /v2/api/clientes/usuario/:usuarioId
 */

// Esta función elimina un cliente de la base de datos usando el id del usuario
// Si el cliente es encontrado y eliminado, devuelve un mensaje de éxito            
// Si no se encuentra el cliente, devuelve un mensaje de error
const eliminarCliente = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const clienteEliminado = await modeloCliente.findOneAndDelete({ usuario: usuarioId });

        if (clienteEliminado) {
            res.status(200).json({ mensaje: "Cliente eliminado exitosamente." });
        } else {
            res.status(404).json({ mensaje: `No se encontró el cliente asociado al usuario con id '${usuarioId}' para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al eliminar el cliente." });
    }
};


// Exporta las funciones para que puedan ser usadas en las rutas
// Estas funciones serán llamadas por los routers para manejar las solicitudes HTTP
module.exports = {
    obtenerClientes,
    obtenerClientePorUsuario,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};