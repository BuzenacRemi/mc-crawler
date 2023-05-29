const http = require('http');
const express = require('express');
const mustacheExpress = require('mustache-express');
const { Pool } = require('pg');

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

/*createTable();

async function createTable(){
  const client = await pool.connect();

  try {
    //client.query('DROP TABLE servers');
    await client.query('CREATE TABLE IF NOT EXISTS servers(ip varchar(50) PRIMARY KEY,name VARCHAR(75),iconUrl varchar(255), version varchar(15), online BIT, tags text[]);');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'play.funcraft.fr\',\'Funcraft\',\'https://pbs.twimg.com/profile_images/1083667374379855872/kSsOCKM7_400x400.jpg\',\'1.8.9\',\'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'play.hypixel.com\',\'Hypixel\',\'https://hypixel.net/styles/hypixel-v2/images/hypixel.png\',\'1.9.x\',\'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'play.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\',\'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.8.9\',\'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.8\', \'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.8\',\'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'www.funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.14.2\',\'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'www.hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.9.10\',\'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'www.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.7.10\', \'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'mc.funcraft.fr\',\'Funcraft\',\'\\xDEADBEEF\',\'1.6.4\', \'1\',\'{\"modded\", \"minigames\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'mc.hypixel.com\',\'Hypixel\',\'\\xDEADBEEF\',\'1.2.5\', \'0\',\'{\"vanilla\", \"uhc\", \"plugins\"}\')');
    client.query('INSERT INTO servers (ip, name, iconUrl, version, online, tags) VALUES (\'mc.epicube.com\',\'Epicube\',\'\\xDEADBEEF\',\'1.6.2\', \'0\',\'{\"modded\", \"pvp\", \"plugins\"}\')');
  }catch (err) {
    console.log(err);
  }finally{
    client.release();
  }
}*/

app.get('/', async (req, res) => {
  var tri = req.query.tri;
  var tag = req.query.tag;

  const {rows: tagsSel} = await pool.query('SELECT tags FROM servers');
  let tagList = [];

  tagsSel.forEach(item => {
    item.tags.forEach(tag => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
    });
  });
  tagsL = {tags : tagList}
  const {rows: servers} = await pool.query(generateQuery(tri, tag));
  res.render('index', { servers, tagsL});
});

function generateQuery(tri, tag){
  if (typeof tri === 'undefined') {
    if (typeof tag === 'undefined') {
      return "SELECT * FROM servers";
    }else{
      return "SELECT * FROM servers WHERE "+"'"+tag+"'"+" = ANY(tags)"
    }
  }else{
    if (typeof tag === 'undefined') {
      return "SELECT * FROM servers order by " +tri;
    }else{
      return "SELECT * FROM servers WHERE "+"'"+tag+"'"+" = ANY(tags) order by " + tri;
    }
  }
}

app.listen(8080, () => {
  console.log('Serveur démarré sur le port 8080');
});
