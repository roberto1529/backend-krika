var express = require("express");
var conn = require("./../config/db");
const { verificarkey } = require("./../middleware/jwt");
var rt = express.Router();


rt.post("/crear", verificarkey, (req, res) => {
  const { nombre, responsable, estado } = req.body;
  const sql = `INSERT INTO krika.tareas (nombre, responsable_id, estado) VALUES (?,?,?)`;
  conn.query(sql, [nombre, responsable, estado], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al crear tarea" });
    res.json({ mensaje: "Tarea creada correctamente" });
  });
});

rt.post("/listar", verificarkey, (reqs, res) => {
  
  let sql;
  let req = reqs.body;

  console.log(req)  

  if (req.usuario.rol === "administrador") {
    sql = `SELECT t.id, t.nombre, t.estado, u.nombre as responsable 
           FROM krika.tareas t 
           JOIN krika.usuarios u ON t.responsable_id  = u.id`;
  } else {
    sql = `SELECT t.id, t.nombre, t.estado, u.nombre as responsable 
           FROM krika.tareas t 
           JOIN krika.usuarios u ON t.responsable_id = u.id 
           WHERE t.responsable_id = ?`;
  }

  conn.query(sql,[req.usuario.id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al listar tareas" });
    res.json({ tareas: results });
  });
});


rt.put("/actualizar/:id", verificarkey, (req, res) => {
  const { nombre, responsable, estado } = req.body;
  const { id } = req.params;

  const sql = `UPDATE krika.tareas SET nombre = ?, responsable_id = ?, estado = ? WHERE id = ?`;
  conn.query(sql, [nombre, responsable, estado, id], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al actualizar tarea" });
    res.json({ mensaje: "Tarea actualizada correctamente" });
  });
});


rt.put("/estado/:id", verificarkey, (req, res) => {
  const { estado } = req.body;
  const { id } = req.params;
  const sql = `UPDATE krika.tareas SET estado=? WHERE id=?`;
  conn.query(sql, [estado, id], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al actualizar estado" });
    res.json({ mensaje: "Estado actualizado" });
  });
});


rt.delete("/eliminar/:id", verificarkey, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM krika.tareas WHERE id=?`;
  conn.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al eliminar tarea" });
    res.json({ mensaje: "Tarea eliminada" });
  });
});

module.exports = rt;
