// Importa mongoose y el Schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Expresión regular sencilla para validar teléfonos (ajusta según tu país si lo deseas)
const telefonoRegex = /^[0-9]{7,15}$/;

// Esquema del modelo Cliente
const clienteSchema = new Schema({
    // Referencia obligatoria al usuario base
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // Nombre del modelo de usuario
        required: true,
        unique: true // Un usuario solo puede tener un perfil de cliente
    },
    // Documento obligatorio y único del cliente (cédula, DNI, etc)
    documento: {
        type: String,
        required: [true, 'El documento es obligatorio.'],
        unique: true, // No puede haber dos clientes con el mismo documento
        trim: true
    },
    // Teléfono obligatorio del cliente
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio.'],
        match: [telefonoRegex, 'Por favor, introduce un teléfono válido.']
    },
    // Dirección obligatoria para el envío
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria.'],
        trim: true
    },
    // Fecha de nacimiento obligatoria
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria.']
    },
    // Ciudad obligatoria
    ciudad: {
        type: String,
        required: [true, 'La ciudad es obligatoria.'],
        trim: true
    },
    // Código postal obligatorio
    codigoPostal: {
        type: String,
        required: [true, 'El código postal es obligatorio.'],
        trim: true
    },
    // Historial de compras del cliente
    historialCompras: [
        {
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            precioCompra: {
                type: Number,
                required: true
            },
            fecha: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
    versionKey: false // No usa __v
});

// Exporta el modelo Cliente
const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;