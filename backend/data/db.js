const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',         
  database: 'location-des-voitures',
});

module.exports = pool;