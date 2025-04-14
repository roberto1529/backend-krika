var express = require("express");
const { generarKey, verificarkey } = require("./../middleware/jwt");
var conn = require('./../config/db')
var rt = express.Router();



rt.post("/autenticar", function (req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);
  
  const sql = `SELECT id, nombre, apellido, correo, contrasena, rol, created_at
    FROM krika.usuarios
    WHERE correo= ? and contrasena= ?`;
  conn.query(sql, [email, password], (err, results)=>{
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: "Error al autenticar" });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = generarKey(email);
    res.json({ tk: token, datos: results });
  });

});

rt.get("/usuarios", verificarkey, function (req, res, next) {
  const sql = `SELECT id, nombre, apellido, correo, rol, created_at
               FROM krika.usuarios`;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }

    res.json({ usuarios: results });
  });
});

rt.post("/registrar", function (req, res) {
  const { nombre, apellido, correo, contrasena, rol } = req.body;
  const sql = `INSERT INTO krika.usuarios (nombre, apellido, correo, contrasena, rol)
               VALUES (?, ?, ?, ?, ?)`;
  conn.query(sql, [nombre, apellido, correo, contrasena, rol], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: "Error al registrar usuario" });
    }
    res.json({ mensaje: "Usuario registrado correctamente" });
  });
});



rt.put("/editar/:id", function (req, res) {
  const { id } = req.params;
  const { nombre, apellido, correo, contrasena, rol } = req.body; 
  const sql = `UPDATE krika.usuarios 
               SET nombre = ?, apellido = ?, correo = ?, contrasena = ?, rol = ? 
               WHERE id = ?`;

  conn.query(sql, [nombre, apellido, correo, contrasena, rol, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario actualizado correctamente" });
  });
});



module.exports = rt;
