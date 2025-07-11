// --- Importaciones de Módulos ---
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

// Base URL de la API del backend.
const API_BASE_URL = process.env.URL_BASE || "http://localhost:9090";


// --- Ruta para mostrar el catálogo de productos publicados ---
router.get("/catalogo", async (req, res) => {
  try {
    // Obtenemos SOLO los productos publicados usando el query param
    const { data: productos } = await axios.get(`${API_BASE_URL}/v2/api/productos?publicado=true`);

    // Ya no necesitas filtrar, porque ya solo llegan los publicados
    console.log("Productos publicados enviados al catálogo:", productos);

    res.render("pages/catalogo", {
      productos,
      title: "Catálogo de Productos",
      usuario: req.session && req.session.usuario ? req.session.usuario : null
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.toJSON?.() || error);
    res.status(500).render("pages/error", {
      error: "Error del servidor",
      message: "No se pudo cargar el catálogo. Revise el backend.",
      usuario: req.session && req.session.usuario ? req.session.usuario : null
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
    usuario: req.session && req.session.usuario ? req.session.usuario : null
  });
});

/**
 * Ruta POST para procesar el inicio de sesión.
 * Se guarda el usuario autenticado en la sesión.
 */
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  try {
    // Llamada al endpoint correcto del backend con los campos que espera (correo y password)
    const response = await axios.post(`${API_BASE_URL}/v2/api/auth/login`, {
      correo,
      password // Debe llamarse password según tu backend
    });
    const usuario = response.data.usuario; // El backend responde { mensaje, token, usuario }

    if (!usuario) {
      return res.status(401).render("pages/login", {
        title: "Iniciar Sesión",
        error: "Usuario no encontrado",
        success: null,
        usuario: null
      });
    }

    // Guarda el usuario en la sesión (requiere express-session configurado en app.js)
    req.session.usuario = usuario;

    res.redirect("/catalogo");
  } catch (error) {
    // Extraemos el mensaje de error real del backend si existe
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
      usuario: null
    });
  }
});

/**
 * Ruta GET para mostrar el formulario de registro.
 */
router.get("/register", (req, res) => {
  res.render("pages/register", { error: null, usuario: req.session && req.session.usuario ? req.session.usuario : null });
});

/**
 * Ruta POST para procesar el registro de usuario.
 */
router.post("/register", async (req, res) => {
  // Extraemos los datos del formulario de registro
  const { nombreCompleto, correo, password } = req.body; 
  try {
    await axios.post(`${API_BASE_URL}/v2/api/auth/register`, {
      nombreCompleto,
      correo,
      password
    });
    res.redirect("/login?registered=true");
  } catch (error) {
    // Extraemos el mensaje de error real del backend si existe
    let errorMessage = 'No se pudo completar el registro. Verifique sus datos.';

    // Verifica si el error tiene una respuesta del backend
    // y extrae el mensaje de error específico si está disponible
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
    res.status(400).render("pages/register", { error: errorMessage, usuario: null });
  }
});

/**
 * Ruta GET para mostrar el perfil del usuario.
 */
router.get("/perfil", async (req, res) => {
  try {
    // Si no hay usuario autenticado, redirige a login
    if (!req.session || !req.session.usuario) {
      return res.redirect("/login");
    }

    // Llama al backend para obtener el perfil
    const response = await axios.get(`${API_BASE_URL}/v2/api/usuarios/perfil`, {
      // Puedes pasar cookies/token aquí si tu backend lo requiere
      // headers: { Cookie: req.headers.cookie }
    });
    const { usuario, cliente } = response.data;
    res.render("pages/perfil", {
      usuario: usuario,
      cliente: cliente,
      error: null
    });
  } catch (error) {
    console.error("Error al cargar el perfil:", error.toJSON?.() || error);
    res.status(500).render("pages/perfil", {
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
    if (!req.session || !req.session.usuario) {
      return res.redirect("/login");
    }
    const productoId = req.params.productoId;
    await axios.post(`${API_BASE_URL}/v2/api/compras/comprar/${productoId}`, {}, {
      // headers: { ... }
    });
    res.redirect("/perfil");
  } catch (error) {
    res.status(500).send("Hubo un error al procesar tu compra.");
  }
});

/**
 * Ruta para cerrar sesión del usuario.
 */
router.get("/auth/logout", (req, res) => {
  // Destruye la sesión y redirige a login
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

/**
 * Ruta raíz: Redirige a login por defecto.
 */
router.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = router;