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
  var pre = req.query.premium;

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

function generateQuery(tri, tag, premium) {
  let query = 'SELECT * FROM servers';
  const values = [];

  if (typeof tag !== 'undefined' && tag !== 'all') {
    query += ' WHERE $1 = ANY(tags)';
    values.push(tag);
  }

  if (typeof premium !== 'undefined') {
    if (premium === 1) {
      if (values.length === 0) {
        query += ' WHERE premium = 1';
      } else {
        query += ' AND premium = 1';
      }
    }else{
      if (values.length === 0) {
        query += ' WHERE premium = 0';
      } else {
        query += ' AND premium = 0';
      }
    }
  }

  if (typeof tri !== 'undefined') {
    query += ' ORDER BY $' + (values.length + 1);
    values.push(tri);
  }

  return pool.query(query, values);
}

app.listen(8080, () => {
  console.log('Serveur démarré sur le port 8080');
});
