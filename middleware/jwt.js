const jwt = require('jsonwebtoken');

function generarKey(usuario) {
  return jwt.sign(
    { user: usuario },  'Rmolina1529**', { expiresIn: '6h' }
  );
}

function verificarkey(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ mensaje: 'Token no proporcionado.' });
  }

  jwt.verify(token, 'Rmolina1529**', (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: 'Petición bloqueada por politicas de seguridad' });
    }

    req.usuario = decoded;
    next();
  });
}


module.exports = { generarKey, verificarkey };
