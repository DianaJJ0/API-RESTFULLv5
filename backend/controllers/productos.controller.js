const modeloProducto = require("../models/productos.model");

// Obtener productos (con filtro ?publicado=true)
// Devuelve una lista de productos filtrados por estado de publicación
const obtenerProductos = async (req, res) => {
  try {
    let filtro = {};
    if (req.query.publicado) {
      filtro.publicado = req.query.publicado === "true";
    }
    const productos = await modeloProducto.find(filtro);
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res
      .status(500)
      .json({
        mensaje: "Error interno del servidor al obtener los productos.",
      });
  }
};

// Obtener producto por referencia
// Busca un producto por su referencia y devuelve sus detalles
const obtenerProducto = async (req, res) => {
  try {
    const productoEncontrado = await modeloProducto.findOne({
      referencia: req.params.ref,
    });
    if (productoEncontrado) {
      res.status(200).json(productoEncontrado);
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró ningún producto con la referencia '${req.params.ref}'`,
        });
    }
  } catch (error) {
    console.error("Error al buscar el producto por referencia:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Crear producto
// Crea un nuevo producto y lo guarda en la base de datos
const crearProducto = async (req, res) => {
  try {
    const insercion = await modeloProducto.create(req.body);
    res.status(201).json(insercion);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res
      .status(400)
      .json({ mensaje: "Datos de entrada inválidos.", error: error.message });
  }
};

// Actualizar producto por referencia
const actualizarProducto = async (req, res) => {
  try {
    const actualizado = await modeloProducto.findOneAndUpdate(
      { referencia: req.params.ref },
      req.body,
      { new: true, runValidators: true }
    );
    if (actualizado) {
      res
        .status(200)
        .json({ mensaje: "Actualización exitosa", producto: actualizado });
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró el producto con referencia '${req.params.ref}' para actualizar.`,
        });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar el producto.",
        error: error.message,
      });
  }
};


// Eliminar producto por referencia
const eliminarProducto = async (req, res) => {
  try {
    const eliminacion = await modeloProducto.findOneAndDelete({
      referencia: req.params.ref,
    });
    if (eliminacion) {
      res.status(200).json({ mensaje: "Producto eliminado exitosamente." });
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró el producto con referencia '${req.params.ref}' para eliminar.`,
        });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
