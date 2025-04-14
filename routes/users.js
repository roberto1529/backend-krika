var express = require("express");
const { generarKey, verificarkey } = require("./../middleware/jwt");
var conn = require('./../config/db')
var rt = express.Router();

/* GET users listing. Demo */
rt.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

rt.post("/autenticar", function (req, res, next) {
  const { usuario, clave } = req.body;

  const sql = 
  conn.query()
  const us_val = users_temp.find((u) => u.user === usuario && u.pass === clave);
  if (!us_val) {
    return res.status(401).json({ mensaje: "Credenciales inválidas" });
  }

  const token = generarKey(usuario);
  res.json({ token });
});

rt.get("/protegido", verificarkey, function (req, res, next) {
  res.json({ mensaje: "Acceso autorizado", usuario: req.usuario });
});

module.exports = rt;
