const modeloUsuario = require("../models/usuarios.model");
const bcrypt = require("bcryptjs");

const obtenerUsuarios = async (req, res) => {
  try {
    const listaUsuarios = await modeloUsuario.find({}, "-password");
    res.status(200).json(listaUsuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al obtener usuarios." });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombreCompleto, fechaNacimiento, correo, password, rol } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ mensaje: "El campo 'password' es obligatorio." });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);
    const usuarioGuardado = await modeloUsuario.create({
      nombreCompleto,
      fechaNacimiento,
      correo,
      password: passwordEncriptada,
      rol,
    });
    const usuarioParaRespuesta = usuarioGuardado.toObject();
    delete usuarioParaRespuesta.password;
    res
      .status(201)
      .json({
        mensaje: "Usuario creado exitosamente",
        usuario: usuarioParaRespuesta,
      });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({
          mensaje: "Error al crear el usuario: el correo ya está registrado.",
        });
    }
    res
      .status(400)
      .json({ mensaje: "Error al crear el usuario.", error: error.message });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    delete req.body.password;
    const usuarioActualizado = await modeloUsuario
      .findOneAndUpdate({ correo: req.params.email }, req.body, {
        new: true,
        runValidators: true,
      })
      .select("-password");
    if (usuarioActualizado) {
      res
        .status(200)
        .json({
          mensaje: "Usuario actualizado exitosamente",
          usuario: usuarioActualizado,
        });
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró el usuario con correo '${req.params.email}'`,
        });
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res
      .status(400)
      .json({
        mensaje: "Error al actualizar el usuario.",
        error: error.message,
      });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await modeloUsuario.findOneAndDelete({
      correo: req.params.email,
    });
    if (usuarioEliminado) {
      res.status(200).json({ mensaje: "Usuario eliminado exitosamente" });
    } else {
      res
        .status(404)
        .json({
          mensaje: `No se encontró el usuario con correo '${req.params.email}'`,
        });
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar el usuario." });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
