const Cliente = require('../models/clientes.model.js');
const Producto = require('../models/productos.model.js');
const Usuario = require('../models/usuarios.model.js');

// ============ FUNCIÓN PARA PROCESAR UNA COMPRA  ========================
const realizarCompra = async (req, res) => {
    try {
        const usuarioId = req.usuario._id; 
        const productoId = req.params.productoId;

        // 1. Verificar que el producto existe
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado." });
        }

        // 2. Buscar si el usuario ya tiene un perfil de cliente
        let cliente = await Cliente.findOne({ usuario: usuarioId });

        // 3. Si NO es cliente, se crea su perfil pidiendo datos extra desde req.body
        if (!cliente) {
            const { telefono, direccion, fechaNacimiento, ciudad, codigoPostal } = req.body;

            // Validar que todos los datos extra estén presentes
            if (!telefono || !direccion || !fechaNacimiento || !ciudad || !codigoPostal) {
                return res.status(400).json({ 
                    mensaje: "Faltan datos para crear el perfil de cliente. Debes enviar teléfono, dirección, fecha de nacimiento, ciudad y código postal." 
                });
            }

            cliente = new Cliente({
                usuario: usuarioId,
                telefono,
                direccion,
                fechaNacimiento,
                ciudad,
                codigoPostal,
                historialCompras: []
            });
        }

        // 4. Añadir el producto y el precio al historial de compras del cliente
        cliente.historialCompras.push({ 
            producto: productoId,
            precioCompra: producto.precio
        });
        await cliente.save();

        // 5. Responder con éxito y el estado actualizado del cliente
        res.status(200).json({
            mensaje: "Compra realizada exitosamente.",
            cliente: cliente
        });

    } catch (error) {
        console.error("Error al realizar la compra:", error);
        res.status(500).json({ mensaje: "Hubo un error al procesar la compra." });
    }
};

// ===================     FUNCIÓN PARA DEVOLVER EL PERFIL DEL USUARIO   ================
const obtenerPerfil = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;

        // Buscamos el perfil de cliente asociado al usuario logueado.
        const cliente = await Cliente.findOne({ usuario: usuarioId })
            .populate({
                path: 'historialCompras.producto',
                model: 'Producto'
            });

        // Enviamos los datos del usuario y del cliente como JSON.
        res.status(200).json({
            usuario: req.usuario,
            cliente: cliente
        });

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        res.status(500).json({ mensaje: "Hubo un error al cargar la información del perfil." });
    }
};

module.exports = {
    realizarCompra,
    obtenerPerfil
};