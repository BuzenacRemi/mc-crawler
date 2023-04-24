const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'db',
  database: 'postgres',
  port: 5432, 
});

createTable();

async function createTable(){
  const client = await pool.connect();
  try {
    client.query('DROP TABLE servers');
    await client.query('CREATE TABLE IF NOT EXISTS servers(ip cidr PRIMARY KEY,name VARCHAR(75),icon bytea, version varchar(15), max_slot INT, premium BIT);');
    client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium) VALUES (\'127.0.0.1\',\'localhost\',\'\\xDEADBEEF\',\'1.8.9\', 10,\'1\')');
  }finally{
    client.release();
  }
}


async function getAllData() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM servers');
    return result.rows;
  } finally {
    client.release();
  }
}

http.createServer(async (req, res) => {
  try {
    const data = await getAllData();

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<html><body><ul>');
    data.forEach((item) => {
      res.write(`<li>${item.ip} - ${item.name} - ${item.version}</li>`);
    });
    res.write('</ul></body></html>');
    res.end();
  } catch (err) {
    console.error(err);

    res.writeHead(500, {'Content-Type': 'text/html'});
    res.write('<html><body><h1>Erreur de connexion a la base de donnees</h1></body></html>');
    res.end();
  }
}).listen(8080, () => {
  console.log('Serveur en cours d\'exécution sur le port 8080');
});
