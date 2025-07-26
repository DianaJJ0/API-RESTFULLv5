const mongoose = require("mongoose");
require("dotenv").config();

// Conexión BD
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error);
    throw new Error("Error al iniciar la base de datos. Ver logs.");
  }
};

module.exports = { dbConnection };
