// --- Importaciones de Módulos ---
const express = require("express");
require("dotenv").config();
const path = require("path");

// 1. Importamos express-session para manejo de sesiones
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuración del Motor de Plantillas (EJS) ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Middlewares para archivos estáticos ---
app.use(express.static(path.join(__dirname, "public")));

// --- Middleware para parsear datos de formularios (POST) ---
// Permite recibir datos de formularios con codificación URL (para datos tipo formulario)
// Esto es necesario para procesar los datos enviados desde formularios HTML
app.use(express.urlencoded({ extended: true }));

// --- Middleware para parsear datos en formato JSON  ---
app.use(express.json());


// --- Middleware para manejar sesiones de usuario ---

// 2. Configuración y uso del middleware de sesiones

// Este middleware permite manejar sesiones de usuario en el frontend
// Las sesiones permiten almacenar datos del usuario entre diferentes peticiones HTTP
// Aquí se configura la sesión con una clave secreta y opciones de seguridad
// La cookie de sesión se configura para que sea segura y tenga una duración de 2 horas
// Esto es útil para mantener al usuario autenticado sin necesidad de enviar el token en cada petición
// La cookie se puede usar para almacenar el token JWT o cualquier otro dato de sesión necesario
app.use(
  session({
    secret: "contrasena2025", // Cambia este valor por una clave segura en producción
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true solo para HTTPS
      maxAge: 1000 * 60 * 60 * 2, // 2 horas de expiración 
    },
  })
);

// --- Importar y usar el router de vistas (frontend/router.js) ---

const viewsRouter = require("./router");

// Este router maneja las rutas del frontend, como el catálogo, login, etc.
app.use("/", viewsRouter);

// --- Manejo de errores 404 (Página no encontrada) ---
app.use((req, res, next) => {
  res.status(404).render("pages/error", {
    error: "404 - Página no encontrada",
    message: "La página que buscas no existe.",
  });
});

// --- Middleware de manejo de errores generales ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", {
    error: "500 - Error interno del servidor",
    message: err.message,
  });
});

// --- Iniciar el servidor en el puerto configurado ---
app.listen(PORT, () => {
  console.log(`Frontend corriendo en http://localhost:${PORT}`);
});