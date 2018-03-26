const express = require('express');
const mysql = require('mysql');
var conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mayi1991',
  database: 'blog'
});

module.exports = function(){
  var router = express.Router();
  router.get('/get_banner', (req, res) => {
    conn.query(`SELECT * FROM banner_table`, (err, data) => {
      if(err){
        res.status(500).send(err).end();
      }else{
        res.send(data).end();
      }
    })
  });

  router.get('/get_custom', (req, res) => {
    conn.query(`SELECT * FROM custom_table`, (err, data) => {
      if (err) {
        res.status(500).send(err).end();
      } else {
        res.send(data).end();
      }
    })
  });
  return router;
}