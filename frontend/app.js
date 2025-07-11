// --- Importaciones de Módulos ---
const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuración del Motor de Plantillas (EJS) ---
app.set("view engine", "ejs"); 

app.set("views", path.join(__dirname, "views")); 

// --- Middlewares para archivos estáticos ---
app.use(express.static(path.join(__dirname, "public")));

// --- Middleware para parsear datos de formularios (POST) ---
app.use(express.urlencoded({ extended: true }));

// --- Middleware para parsear datos en formato JSON  ---
app.use(express.json());

// --- Importar y usar el router de vistas (frontend/router.js) ---
const viewsRouter = require("./router");

// Este router maneja las rutas del frontend, como el catálogo, login, etc.
app.use("/", viewsRouter); 

// --- Manejo de errores 404 (Página no encontrada) ---
app.use((req, res, next) => {
  res.status(404).render("pages/error", { 
    error: "404 - Página no encontrada", 
    message: "La página que buscas no existe." 
  });
});

// --- Middleware de manejo de errores generales ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", { 
    error: "500 - Error interno del servidor", 
    message: err.message 
  });
});

// --- Iniciar el servidor en el puerto configurado ---
app.listen(PORT, () => {
  console.log(`Frontend corriendo en http://localhost:${PORT}`);
});