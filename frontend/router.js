// --- Importaciones de Módulos ---
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Base URL de la API del backend.
const API_BASE_URL = process.env.URL_BASE || "http://localhost:9090";

//-------------------------------------------------

// --- Ruta para mostrar el catálogo de productos publicados ---
router.get("/catalogo", async (req, res) => {
  try {
    const { data: productos } = await axios.get(
      `${API_BASE_URL}/v2/api/productos?publicado=true`
    );
    res.render("pages/catalogo", {
      productos,
      title: "Catálogo de Productos",
      usuario: req.session && req.session.usuario ? req.session.usuario : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.toJSON?.() || error);
    res.status(500).render("pages/error", {
      error: "Error del servidor",
      message: "No se pudo cargar el catálogo. Revise el backend.",
      usuario: req.session && req.session.usuario ? req.session.usuario : null,
    });
  }
});

// Login GET
router.get("/login", (req, res) => {
  const registered = req.query.registered === "true";
  res.render("pages/login", {
    title: "Iniciar Sesión",
    error: null,
    success: registered
      ? "¡Registro exitoso! Ahora puedes iniciar sesión."
      : null,
    usuario: req.session && req.session.usuario ? req.session.usuario : null,
  });
});

// Login POST
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  try {
    const response = await axios.post(`${API_BASE_URL}/v2/api/auth/login`, {
      correo,
      password,
    });
    const usuario = response.data.usuario;
    if (!usuario) {
      return res.status(401).render("pages/login", {
        title: "Iniciar Sesión",
        error: "Usuario no encontrado",
        success: null,
        usuario: null,
      });
    }
    req.session.usuario = usuario;
    res.redirect("/catalogo");
  } catch (error) {
    let errorMessage = "Credenciales incorrectas o error del servidor";
    if (
      error.response &&
      error.response.data &&
      (error.response.data.error || error.response.data.mensaje)
    ) {
      errorMessage = error.response.data.error || error.response.data.mensaje;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error("Error al iniciar sesión:", errorMessage);
    return res.status(401).render("pages/login", {
      title: "Iniciar Sesión",
      error: errorMessage,
      success: null,
      usuario: null,
    });
  }
});

// Registro GET
router.get("/register", (req, res) => {
  res.render("pages/register", {
    error: null,
    usuario: req.session && req.session.usuario ? req.session.usuario : null,
  });
});

// Registro POST
router.post("/register", async (req, res) => {
  const { nombreCompleto, correo, password } = req.body;
  try {
    await axios.post(`${API_BASE_URL}/v2/api/auth/register`, {
      nombreCompleto,
      correo,
      password,
    });
    res.redirect("/login?registered=true");
  } catch (error) {
    let errorMessage = "No se pudo completar el registro. Verifique sus datos.";
    if (
      error.response &&
      error.response.data &&
      (error.response.data.mensaje || error.response.data.error)
    ) {
      errorMessage = error.response.data.mensaje || error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error("Error al registrar usuario:", errorMessage);
    res
      .status(400)
      .render("pages/register", { error: errorMessage, usuario: null });
  }
});

// Perfil usuario
router.get("/perfil", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.redirect("/login");
    }
    const response = await axios.get(`${API_BASE_URL}/v2/api/usuarios/perfil`);
    const { usuario, cliente } = response.data;
    res.render("pages/perfil", {
      usuario: usuario,
      cliente: cliente,
      error: null,
    });
  } catch (error) {
    console.error("Error al cargar el perfil:", error.toJSON?.() || error);
    res.status(500).render("pages/perfil", {
      usuario: null,
      cliente: null,
      error: "Hubo un error al cargar tu información.",
    });
  }
});

// Comprar producto
router.post("/comprar/:productoId", async (req, res) => {
  try {
    if (!req.session || !req.session.usuario) {
      return res.redirect("/login");
    }
    const productoId = req.params.productoId;
    await axios.post(
      `${API_BASE_URL}/v2/api/compras/comprar/${productoId}`,
      {}
    );
    res.redirect("/perfil");
  } catch (error) {
    res.status(500).send("Hubo un error al procesar tu compra.");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Raíz
router.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = router;
