const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios.model");

// Verificar usuario en cada petición

// Middleware que verifica si el usuario está autenticado y agrega su información a res.locals
// Esto permite acceder a la información del usuario en las vistas y otros middlewares

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "tu_secreto_por_defecto",
      async (err, decodificado) => {
        if (err) {
          res.locals.usuario = null;
          next();
        } else {
          const usuario = await Usuario.findById(decodificado.id).select(
            "-password"
          );
          res.locals.usuario = usuario;
          next();
        }
      }
    );
  } else {
    res.locals.usuario = null;
    next();
  }
};


// Proteger rutas

// Middleware que protege rutas específicas asegurando que el usuario esté autenticado
// Si no está autenticado, redirige al login

const protegerRuta = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu_secreto_por_defecto"
    );
    const usuario = await Usuario.findById(decodificado.id).select("-password");
    if (usuario) {
      req.usuario = usuario;
      return next();
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    return res.clearCookie("jwt").redirect("/login");
  }
};

module.exports = {
  checkUser,
  protegerRuta,
};
