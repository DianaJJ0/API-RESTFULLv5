const Cliente = require('../models/clientes.model.js');
const Producto = require('../models/productos.model.js');
const Usuario = require('../models/usuarios.model.js');

// ============ FUNCIÓN PARA PROCESAR UNA COMPRA  ========================

// Esta función maneja la lógica de compra de un producto por parte de un usuario
// Verifica si el usuario es cliente, crea su perfil si no lo es, y registra la compra en su historial
// Se asume que el usuario ya está autenticado y su ID está disponible en req.usuario......

// El producto a comprar se pasa como parámetro en la URL (req.params.productoId)
// El cliente debe enviar datos adicionales como teléfono, dirección, etc. en el cuerpo de la solicitud (req.body)              
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

            // Crear el cliente con los datos extra
            // Se asocia el cliente al usuario mediante el campo 'usuario'
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
        // Guardar el cliente actualizado
        // Esto actualiza el historial de compras del cliente
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


// Esta función devuelve el perfil del usuario autenticado, incluyendo sus datos y el perfil de cliente si existe
// Se usa para mostrar la información del usuario y su historial de compras en el frontend
// Se asume que el usuario ya está autenticado y su ID está disponible en req.usuario


// Si el usuario no tiene un perfil de cliente, se devuelve un mensaje indicando que no es cliente
// Si el usuario tiene un perfil de cliente, se devuelve su información y su historial de compras.                                                                   
const obtenerPerfil = async (req, res) => {
    try {
        // --- SOPORTE SESIÓN PARA PETICIONES DEL FRONTEND ---
        let usuario = req.usuario; // Este viene del JWT (middleware protegerRuta)
        // Si no existe (caso frontend con sesión), intenta usar la sesión del frontend
        if (!usuario && req.session && req.session.usuario) {
            // Buscamos el usuario en la base de datos para tener todos los campos
            usuario = await Usuario.findById(req.session.usuario._id);
        }
        if (!usuario) {
            return res.status(401).json({ mensaje: "No autenticado." });
        }

        // Buscamos el perfil de cliente asociado al usuario logueado.
        const cliente = await Cliente.findOne({ usuario: usuario._id })
            .populate({
                path: 'historialCompras.producto',
                model: 'Producto'
            });

        // Enviamos los datos del usuario y del cliente como JSON.
        res.status(200).json({
            usuario: usuario,
            cliente: cliente
        });

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        res.status(500).json({ mensaje: "Hubo un error al cargar la información del perfil." });
    }
};


// Exporta las funciones para que puedan ser usadas en las rutas
module.exports = {
    realizarCompra,
    obtenerPerfil
};