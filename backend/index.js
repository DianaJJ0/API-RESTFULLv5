const express = require("express");
require("dotenv").config();
const { dbConnection } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 9090;

// Iniciar servidor solo si la BD conecta
dbConnection()
  .then(() => {
    // Middlewares
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Routers
    const usuariosRouter = require("./routers/usuarios.routes");
    const productosRouter = require("./routers/productos.routes");
    const clientesRouter = require("./routers/clientes.routes");
    const compraRouter = require("./routers/compra.routes");
    const authRouter = require("./routers/auth.routes");

    // Prefijo rutas API
    app.use("/v2/api/usuarios", usuariosRouter);
    app.use("/v2/api/productos", productosRouter);
    app.use("/v2/api/clientes", clientesRouter);
    app.use("/v2/api/compras", compraRouter);
    app.use("/v2/api/auth", authRouter);

    // Error 404
    app.use((req, res, next) => {
      res.status(404).json({
        error: "404 - Ruta no encontrada",
        message: "La ruta que buscas no existe en la API REST.",
      });
    });

    // Error general
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        error: "500 - Error interno del servidor",
        message: err.message,
      });
    });

    app.listen(PORT, () => {
      console.log(`Backend API corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
    console.error(
      "Asegúrate de que tu base de datos esté corriendo y configurada correctamente."
    );
    process.exit(1);
  });
