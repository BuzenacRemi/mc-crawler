const http = require('http');
const express = require('express');
const mustacheExpress = require('mustache-express');
const { Pool } = require('pg');
const mcAPI = require('node-mc-api')

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'db',
  database: process.env.POSTGRES_DB,
  port: 5432,
});
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'mustache');
app.use(express.static(__dirname + '/public'));
app.use

createTable();

async function createTable(){
  const client = await pool.connect();
  try {
    client.query('DROP TABLE servers');
    await client.query('CREATE TABLE IF NOT EXISTS servers(ip varchar(150) PRIMARY KEY,name VARCHAR(100),icon bytea, version varchar(150), max_slot INT, premium BIT, tags json);');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'play.funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.8.9\', 10,\'1\',\'{\"tags\": [\"modded\", \"minigames\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'play.hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.x\', 15,\'0\',\'{\"tags\": [\"vanilla\", \"uhc\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'play.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\', 15,\'0\',\'{\"tags\": [\"modded\", \"pvp\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.8.9\', 10,\'1\',\'{\"tags\": [\"modded\", \"minigames\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.x\', 15,\'0\',\'{\"tags\": [\"vanilla\", \"uhc\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\', 15,\'0\',\'{\"tags\": [\"modded\", \"pvp\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'www.funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.8.9\', 10,\'1\',\'{\"tags\": [\"modded\", \"minigames\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'www.hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.x\', 15,\'0\',\'{\"tags\": [\"vanilla\", \"uhc\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'www.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\', 15,\'0\',\'{\"tags\": [\"modded\", \"pvp\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'mc.funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.8.9\', 10,\'1\',\'{\"tags\": [\"modded\", \"minigames\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'mc.hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.x\', 15,\'0\',\'{\"tags\": [\"vanilla\", \"uhc\", \"plugins\"]}\')');
    // client.query('INSERT INTO servers (ip, name, icon, version, max_slot, premium, tags) VALUES (\'mc.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\', 15,\'0\',\'{\"tags\": [\"modded\", \"pvp\", \"plugins\"]}\')');
  }finally{
    client.release();
  }
}

app.get('/', async (req, res) => {
  const { rows: servers } = await pool.query('SELECT * FROM servers');
  servers.forEach(server => server.stats = mcAPI.pingServer(server.ip, {timeout:4000}))
  res.render('index', { servers });
});

app.listen(8080, () => {
  console.log('Serveur démarré sur le port 8080');
});
