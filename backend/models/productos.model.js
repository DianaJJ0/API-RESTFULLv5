const { Schema, model } = require('mongoose');

// Definimos la estructura (el "Schema") de nuestros documentos de productos
const ProductoSchema = new Schema({
    referencia: {
        type: String,
        required: [true, 'La referencia es obligatoria'],
        unique: true, // No puede haber dos productos con la misma referencia
        trim: true    // Quita los espacios en blanco al principio y al final
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo']
    },
    imagen: {
        type: String,
        trim: true,
        default: '' 
    },
    publicado: {
        type: Boolean,
        default: true // Por defecto, un producto nuevo estará publicado
    }
}, {
    timestamps: true
});


// Mongoose buscará la colección en plural: 'productos'
module.exports = model('Producto', ProductoSchema);