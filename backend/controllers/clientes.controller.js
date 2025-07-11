const modeloCliente = require('../models/clientes.model');

/**
 * GET - Obtener todos los clientes.
 * Devuelve la lista de todos los clientes registrados.
 */
const obtenerClientes = async (req, res) => {
    try {
        // Popula los datos básicos del usuario asociado a cada cliente
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

module.exports = {
    obtenerClientes,
    obtenerClientePorUsuario,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};