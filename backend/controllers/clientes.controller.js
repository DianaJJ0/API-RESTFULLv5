const modeloCliente = require("../models/clientes.model");

// Obtener todos los clientes
// Devuelve una lista de todos los clientes con información del usuario asociado
const obtenerClientes = async (req, res) => {
  try {
    const listaClientes = await modeloCliente
      .find()
      .populate("usuario", "nombreCompleto correo rol");
    res.status(200).json(listaClientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al obtener los clientes." });
  }
};

// Obtener cliente por usuario
// Busca un cliente asociado a un usuario específico y devuelve su información
const obtenerClientePorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const cliente = await modeloCliente
      .findOne({ usuario: usuarioId })
      .populate("usuario", "nombreCompleto correo rol");
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró ningún cliente asociado al usuario con id '${usuarioId}'`,
        });
    }
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Crear cliente
// Crea un nuevo cliente asociado a un usuario
const crearCliente = async (req, res) => {
  try {
    if (!req.body.usuario) {
      return res
        .status(400)
        .json({
          mensaje: "Falta el id del usuario en el cuerpo de la solicitud.",
        });
    }
    const clienteGuardado = await modeloCliente.create(req.body);
    res
      .status(201)
      .json({
        mensaje: "Cliente creado exitosamente",
        cliente: clienteGuardado,
      });
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    res
      .status(400)
      .json({
        mensaje: "Error al crear el cliente. Verifique los datos.",
        error: error.message,
      });
  }
};

// Actualizar cliente por usuario
// Actualiza la información de un cliente asociado a un usuario
const actualizarCliente = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const clienteActualizado = await modeloCliente
      .findOneAndUpdate({ usuario: usuarioId }, req.body, {
        new: true,
        runValidators: true,
      })
      .populate("usuario", "nombreCompleto correo rol");
    if (clienteActualizado) {
      res
        .status(200)
        .json({
          mensaje: "Cliente actualizado exitosamente",
          cliente: clienteActualizado,
        });
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró el cliente asociado al usuario con id '${usuarioId}' para actualizar.`,
        });
    }
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar el cliente.",
        error: error.message,
      });
  }
};

// Eliminar cliente por usuario
const eliminarCliente = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const clienteEliminado = await modeloCliente.findOneAndDelete({
      usuario: usuarioId,
    });
    if (clienteEliminado) {
      res.status(200).json({ mensaje: "Cliente eliminado exitosamente." });
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró el cliente asociado al usuario con id '${usuarioId}' para eliminar.`,
        });
    }
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al eliminar el cliente." });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorUsuario,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
