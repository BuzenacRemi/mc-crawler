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
  const {rows: servers} = await generateQuery(tri, tag);
  res.render('index', { servers, tagsL});
});

function generateQuery(tri, tag) {
  if (typeof tri === 'undefined') {
    if (typeof tag === 'undefined' || tag === 'all') {
      return pool.query('SELECT * FROM servers');
    } else {
      return pool.query('SELECT * FROM servers WHERE $1 = ANY()', [tag]);
    }
  } else {
    if (typeof tag === 'undefined' || tag === 'all') {
      return pool.query('SELECT * FROM servers order by $1', [tri]);
    } else {
      return pool.query('SELECT * FROM servers WHERE $1 = ANY(tags) order by $2',[tag, tri]);
    }
  }
  return pool.query('SELECT * FROM servers');
}

app.listen(8080, () => {
  console.log('Serveur démarré sur le port 8080');
});
