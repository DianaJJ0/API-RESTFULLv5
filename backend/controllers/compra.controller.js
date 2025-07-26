const Cliente = require("../models/clientes.model.js");
const Producto = require("../models/productos.model.js");
const Usuario = require("../models/usuarios.model.js");

// Procesar compra

// Permite a un usuario realizar una compra de un producto
// Si el usuario no tiene un perfil de cliente, se crea uno nuevo
const realizarCompra = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    const productoId = req.params.productoId;
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }
    let cliente = await Cliente.findOne({ usuario: usuarioId });
    if (!cliente) {
      const { telefono, direccion, fechaNacimiento, ciudad, codigoPostal } =
        req.body;
      if (
        !telefono ||
        !direccion ||
        !fechaNacimiento ||
        !ciudad ||
        !codigoPostal
      ) {
        return res.status(400).json({
          mensaje:
            "Faltan datos para crear el perfil de cliente. Debes enviar teléfono, dirección, fecha de nacimiento, ciudad y código postal.",
        });
      }
      cliente = new Cliente({
        usuario: usuarioId,
        telefono,
        direccion,
        fechaNacimiento,
        ciudad,
        codigoPostal,
        historialCompras: [],
      });
    }
    cliente.historialCompras.push({
      producto: productoId,
      precioCompra: producto.precio,
    });
    await cliente.save();
    res.status(200).json({
      mensaje: "Compra realizada exitosamente.",
      cliente: cliente,
    });
  } catch (error) {
    console.error("Error al realizar la compra:", error);
    res.status(500).json({ mensaje: "Hubo un error al procesar la compra." });
  }
};


// Obtener perfil usuario
// Devuelve la información del usuario y su perfil de cliente
const obtenerPerfil = async (req, res) => {
  try {
    let usuario = req.usuario;
    if (!usuario && req.session && req.session.usuario) {
      usuario = await Usuario.findById(req.session.usuario._id);
    }
    if (!usuario) {
      return res.status(401).json({ mensaje: "No autenticado." });
    }
    const cliente = await Cliente.findOne({ usuario: usuario._id }).populate({
      path: "historialCompras.producto",
      model: "Producto",
    });
    res.status(200).json({
      usuario: usuario,
      cliente: cliente,
    });
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    res
      .status(500)
      .json({ mensaje: "Hubo un error al cargar la información del perfil." });
  }
};

module.exports = {
  realizarCompra,
  obtenerPerfil,
};
