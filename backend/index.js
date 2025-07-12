// --- Importaciones de Módulos ---
const express = require("express");
require("dotenv").config();

// --- Importación de la función para conectar a la base de datos ---
const { dbConnection } = require("./config/database");

// --- Creación de la aplicación Express ---
// Esta es la instancia principal de nuestra aplicación Express   
const app = express();
const PORT = process.env.PORT || 9090; // Puerto para el backend (API), DIFERENTE al frontend


//------------------------------------------------
// --- Función principal para arrancar el servidor ---

// Primero, conectamos a la base de datos y luego arrancamos el servidor
// Si la conexión falla, el servidor no se arranca para evitar errores posteriores
dbConnection()
  .then(() => {
    // --- Middlewares para procesar datos de formularios y JSON ---
    // Permite recibir datos de formularios con codificación URL (para datos tipo formulario) 
    app.use(express.urlencoded({ extended: true }));

    // Permite recibir y enviar datos en formato JSON
    app.use(express.json());

    // --- Importación de Routers de la API ---
    // Cada router define las rutas CRUD para su recurso
    const usuariosRouter = require("./routers/usuarios.routes");
    const productosRouter = require("./routers/productos.routes");
    const clientesRouter = require("./routers/clientes.routes");
    const compraRouter = require("./routers/compra.routes");
    const authRouter = require("./routers/auth.routes");



    // --- Montaje de Routers con prefijo versión 2 (v2) ---
    // Todas las rutas de la API tendrán el prefijo /v2/api/
    app.use("/v2/api/usuarios", usuariosRouter);    // CRUD de usuarios
    app.use("/v2/api/productos", productosRouter);  // CRUD de productos
    app.use("/v2/api/clientes", clientesRouter);    // CRUD de clientes
    app.use("/v2/api/compras", compraRouter);       // Rutas de compra protegidas
    app.use("/v2/api/auth", authRouter);            // Rutas de autenticación (login, register, logout)


    // --- Middleware de manejo de errores 404 ---
    app.use((req, res, next) => {
      res.status(404).json({
        error: "404 - Ruta no encontrada",
        message: "La ruta que buscas no existe en la API REST."
      });
    });

    // --- Manejo de errores generales ---
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        error: "500 - Error interno del servidor",
        message: err.message
      });
    });

    
    // --- Arranque del servidor ---

    app.listen(PORT, () => {
      console.log(`Backend API corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // Si ocurre un error al conectar la base de datos, NO arranca el servidor
    console.error('No se pudo conectar a la base de datos:', error);
    console.error('Asegúrate de que tu base de datos esté corriendo y configurada correctamente.');

    process.exit(1); // Sale del proceso
  });