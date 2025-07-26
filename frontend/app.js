const express = require("express");
require("dotenv").config();
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Formularios
app.use(express.urlencoded({ extended: true }));

// JSON
app.use(express.json());

// Sesiones
app.use(
  session({
    secret: "contrasena2025",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

// Router vistas
const viewsRouter = require("./router");
app.use("/", viewsRouter);

// Error 404
app.use((req, res, next) => {
  res.status(404).render("pages/error", {
    error: "404 - Página no encontrada",
    message: "La página que buscas no existe.",
  });
});

// Error general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", {
    error: "500 - Error interno del servidor",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Frontend corriendo en http://localhost:${PORT}`);
});
