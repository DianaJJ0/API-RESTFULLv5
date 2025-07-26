const mongoose = require("mongoose");
const { Schema } = mongoose;

// Validación teléfono
const telefonoRegex = /^[0-9]{10}$/;

// Esquema Cliente
const clienteSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      unique: true,
    },
    documento: {
      type: String,
      required: [true, "El documento es obligatorio."],
      unique: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio."],
      match: [telefonoRegex, "Por favor, introduce un teléfono válido."],
    },
    direccion: {
      type: String,
      required: [true, "La dirección es obligatoria."],
      trim: true,
    },
    fechaNacimiento: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria."],
    },
    ciudad: {
      type: String,
      required: [true, "La ciudad es obligatoria."],
      trim: true,
    },
    codigoPostal: {
      type: String,
      required: [false, "El código postal es opcional."],
      trim: true,
    },
    historialCompras: [
      {
        producto: {
          type: Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        precioCompra: {
          type: Number,
          required: true,
        },
        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Modelo Cliente
const Cliente = mongoose.model("Cliente", clienteSchema);

module.exports = Cliente;
