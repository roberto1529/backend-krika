const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Krika2025**',
  database: 'krika'
});

// Conectar a la base
connection.connect(error => {
  if (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    return;
  }
//   console.log('✅ Conectado a la base de datos MySQL');
});

module.exports = connection;
