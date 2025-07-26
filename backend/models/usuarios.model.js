const mongoose = require("mongoose");
const { Schema } = mongoose;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex correo

const usuarioSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: [true, "El nombre completo es obligatorio."],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "El correo electrónico es obligatorio."],
      unique: true, // correo único
      lowercase: true,
      trim: true,
      match: [emailRegex, "Por favor, introduce un correo electrónico válido."],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
      minlength: [8, "La contraseña debe tener al menos 8 caracteres."],
    },
    rol: {
      type: String,
      default: "usuario_basico", // rol por defecto
      enum: ["usuario_basico", "cliente", "empleado", "admin"],
    },
  },
  {
    timestamps: true, // fechas automáticas
    versionKey: false, // sin __v
  }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
