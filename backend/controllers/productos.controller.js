const modeloProducto = require('../models/productos.model');

// --- GET - Obtener todos los productos (API) ---
// Permite filtrar por ?publicado=true si se pasa en la URL
// Si no se pasa, devuelve todos los productos
// Devuelve un array de productos con sus datos
const obtenerProductos = async (req, res) => {
    try {
        // Creamos un objeto filtro vacío
        let filtro = {};

        // Si el query param 'publicado' viene en la URL, lo usamos como filtro
        if (req.query.publicado) {
            // Convertimos el valor a booleano
            filtro.publicado = req.query.publicado === "true";
        }

        const productos = await modeloProducto.find(filtro);
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al obtener los productos." });
    }
};

// --- GET - Obtener un producto por referencia (API) ---

// Busca un producto por su referencia única
// Devuelve el producto encontrado o un mensaje de error si no se encuentra             
const obtenerProducto = async (req, res) => {
    try {
        const productoEncontrado = await modeloProducto.findOne({ referencia: req.params.ref });
        if (productoEncontrado) {
            res.status(200).json(productoEncontrado);
        } else {
            res.status(404).json({ mensaje: `No se encontró ningún producto con la referencia '${req.params.ref}'` });
        }
    } catch (error) {
        console.error("Error al buscar el producto por referencia:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

// --- POST - Crear un nuevo producto (API) ---

// Esta función crea un nuevo producto en la base de datos
// Asegúrate de que el cuerpo de la solicitud contenga todos los campos necesarios
const crearProducto = async (req, res) => {
    try {
        const insercion = await modeloProducto.create(req.body);
        res.status(201).json(insercion);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(400).json({ mensaje: 'Datos de entrada inválidos.', error: error.message });
    }
};

// --- PUT - Actualizar un producto (API) ---

// Esta función actualiza un producto existente usando su referencia única
// Si el producto es encontrado y actualizado, devuelve el producto actualizado
// Si no se encuentra el producto, devuelve un mensaje de error                                                                         
const actualizarProducto = async (req, res) => {
    try {
        const actualizado = await modeloProducto.findOneAndUpdate(
            { referencia: req.params.ref },
            req.body,
            { new: true, runValidators: true }
        );
        if (actualizado) {
            res.status(200).json({ mensaje: "Actualización exitosa", producto: actualizado });
        } else {
            res.status(404).json({ mensaje: `No se encontró el producto con referencia '${req.params.ref}' para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(400).json({ mensaje: "Error al actualizar el producto.", error: error.message });
    }
};

// --- DELETE - Eliminar un producto (API) ---


// Esta función elimina un producto de la base de datos usando su referencia única
// Si el producto es encontrado y eliminado, devuelve un mensaje de éxito
// Si no se encuentra el producto, devuelve un mensaje de error
// Se usa findOneAndDelete para eliminar el producto por su referencia
const eliminarProducto = async (req, res) => {
    try {
        const eliminacion = await modeloProducto.findOneAndDelete({ referencia: req.params.ref });
        if (eliminacion) {
            res.status(200).json({ mensaje: "Producto eliminado exitosamente." });
        } else {
            res.status(404).json({ mensaje: `No se encontró el producto con referencia '${req.params.ref}' para eliminar.` });
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
    eliminarProducto
};