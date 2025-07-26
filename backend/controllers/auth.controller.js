const Usuario = require("../models/usuarios.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const maxAge = 3 * 24 * 60 * 60; // significa 3 días en minutos 

// Crear token JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "tu_secreto_por_defecto", {
    expiresIn: maxAge,
  });
};

// Registro usuario
// Crea un nuevo usuario y guarda su información en la base de datos
const register_post = async (req, res) => {
  const { nombreCompleto, correo, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombreCompleto,
      correo,
      password: hashedPassword,
    });
    res.status(201).json({ mensaje: "Usuario registrado con éxito.", usuario });
  } catch (error) {
    let mensaje = "No se pudo completar el registro. Verifique sus datos.";
    if (error.code === 11000 && error.keyPattern && error.keyPattern.correo) {
      mensaje = "El correo ya está registrado. Usa otro correo.";
    } else if (error.name === "ValidationError") {
      mensaje = Object.values(error.errors)
        .map((err) => err.message)
        .join(" ");
    } else if (error.message) {
      mensaje = error.message;
    }
    console.error("Error en el registro:", mensaje, error);
    res.status(400).json({ mensaje });
  }
};

// Login usuario 
// Verifica las credenciales y genera un token JWT
const login_post = async (req, res) => {
  const { correo, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ correo });
    if (usuario) {
      const auth = await bcrypt.compare(password, usuario.password);
      if (auth) {
        const token = createToken(usuario._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ mensaje: "Login exitoso", token, usuario });
      } else {
        res.status(400).json({ error: "Contraseña incorrecta." });
      }
    } else {
      res.status(400).json({ error: "Este correo no está registrado." });
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor." });
  }
};

// Logout usuario
// Cierra la sesión del usuario eliminando el token JWT
const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ mensaje: "Sesión cerrada correctamente." });
};

module.exports = {
  register_post,
  login_post,
  logout_get,
};
