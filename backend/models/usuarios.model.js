const mongoose = require('mongoose');
const { Schema } = mongoose;
// Expresión regular para validar correos electrónicos
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const usuarioSchema = new Schema({
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es obligatorio.'],
        trim: true
    },
    correo: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio.'],
        unique: true, // No puede haber dos usuarios con el mismo correo
        lowercase: true, // Guarda siempre el correo en minúsculas
        trim: true,
        // 
        match: [emailRegex, 'Por favor, introduce un correo electrónico válido.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres.']
    },
    rol: {
        type: String,
        default: 'usuario_basico', // Todos los usuarios se registran con este rol por defecto
        enum: ['usuario_basico', 'cliente', 'empleado', 'admin']
    }
}, {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
    versionKey: false // No usar __v para evitar confusiones con versiones de documentos

});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;