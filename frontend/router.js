// --- Importaciones de Módulos ---
const express = require("express");
const router = express.Router();
const axios = require("axios"); 
require("dotenv").config();

// Base URL de la API del backend.
const API_BASE_URL = process.env.URL_BASE || "http://localhost:9090";

/**
 * Ruta para mostrar el catálogo de productos publicados.
 */
router.get("/catalogo", async (req, res) => { 
  try {
    const { data: productos } = await axios.get(`${API_BASE_URL}/v2/api/productos`);
    const productosPublicados = productos.filter(p => p.publicado);

    res.render("pages/catalogo", {
      productos: productosPublicados,
      title: "Catálogo de Productos",
      usuario: null // <-- IMPORTANTE: Siempre pasar usuario
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.toJSON?.() || error);
    res.status(500).render("pages/error", {
      error: "Error del servidor",
      message: "No se pudo cargar el catálogo. Revise el backend.",
      usuario: null
    });
  }
});

/**
 * Ruta GET para mostrar el formulario de inicio de sesión.
 */
router.get("/login", (req, res) => {
  const registered = req.query.registered === "true";
  res.render("pages/login", { 
    title: "Iniciar Sesión",
    error: null,
    success: registered ? "¡Registro exitoso! Ahora puedes iniciar sesión." : null,
    usuario: null // <-- IMPORTANTE
  });
});

/**
 * Ruta POST para procesar el inicio de sesión.
 */
router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const response = await axios.post(`${API_BASE_URL}/v2/api/login`, {
      correo,
      contrasena,
    });
    const usuario = response.data;

    if (!usuario) {
      return res.status(401).render("pages/login", {
        title: "Iniciar Sesión",
        error: "Usuario no encontrado",
        success: null,
        usuario: null
      });
    }
    res.redirect("/catalogo");
  } catch (error) {
    console.error("Error al iniciar sesión:", error.toJSON?.() || error);
    return res.status(401).render("pages/login", {
      title: "Iniciar Sesión",
      error: "Credenciales incorrectas o error del servidor",
      success: null,
      usuario: null
    });
  }
});

/**
 * Ruta GET para mostrar el formulario de registro.
 */
router.get("/register", (req, res) => {
  res.render('pages/register', { error: null, usuario: null });
});


router.post("/register", async (req, res) => {
  const { nombreCompleto, correo, password } = req.body;
  try {
    await axios.post(`${API_BASE_URL}/v2/api/auth/register`, {
      nombreCompleto,
      correo,
      password
    });
    res.redirect('/login?registered=true');
  } catch (error) {
    // Extraemos el mensaje de error real del backend si existe
    let errorMessage = 'No se pudo completar el registro. Verifique sus datos.';
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
    res.status(400).render('pages/register', { error: errorMessage, usuario: null });
  }
});

/**
 * Ruta GET para mostrar el perfil del usuario.
 */
router.get("/perfil", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v2/api/usuarios/perfil`, {
      // headers: { Cookie: req.headers.cookie }
    });
    const { usuario, cliente } = response.data;
    res.render('pages/perfil', {
      usuario: usuario, // Aquí sí hay usuario real
      cliente: cliente,
      error: null
    });
  } catch (error) {
    console.error("Error al cargar el perfil:", error.toJSON?.() || error);
    res.status(500).render('pages/perfil', {
      usuario: null,
      cliente: null,
      error: "Hubo un error al cargar tu información."
    });
  }
});

/**
 * Ruta POST para procesar la compra de un producto.
 */
router.post("/comprar/:productoId", async (req, res) => {
  try {
    const productoId = req.params.productoId;
    await axios.post(`${API_BASE_URL}/v2/api/compras/comprar/${productoId}`, {}, {
      // headers: { ... }
    });
    res.redirect('/perfil');
  } catch (error) {
    res.status(500).send("Hubo un error al procesar tu compra.");
  }
});

/**
 * Ruta raíz: Redirige a login por defecto.
 */
router.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = router;