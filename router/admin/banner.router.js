const express = require('express');
const mysql = require('mysql');
var conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mayi1991',
  database: 'blog'
});

module.exports = function () {
  var router = express.Router();
  router.get('/', (req, res) => {
    switch (req.query.action) {
      case 'update':
        conn.query(`SELECT * FROM banner_table`, (err, banner) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            // res.render('admin/banner.ejs', { banner: data });
            conn.query(`SELECT * FROM banner_table WHERE id='${req.query.id}'`, (err, moddata) => {
              if (err) {
                res.status(500).send(err).end();
              } else {
                res.render('admin/banner.ejs', { banner: banner, moddata: moddata[0] });
              }
            });
          }
        });
        break;
      case 'delete':
        conn.query(`DELETE FROM banner_table WHERE id='${req.query.id}'`, (err, data) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            res.redirect('/admin/banner');
          }
        });
        break;
      default:
        conn.query(`SELECT * FROM banner_table`, (err, data) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            res.render('admin/banner.ejs', { banner: data });
          }
        });
        break;
    }
  });
  router.post('/', (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    var href = req.body.href;
    if (!title || !description || !href) {
      res.status(400).send('arg is error').end();
    } else {
      if (!req.body.id) {
        // 添加
        conn.query(`INSERT INTO banner_table (title,description,href) VALUES ('${title}','${description}','${href}')`, (err, data) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            res.redirect('/admin/banner');
          }
        });
      } else {
        // 修改
        conn.query(`UPDATE banner_table SET\
          title='${req.body.title}',\
          description='${req.body.description}',\
          href='${req.body.href}'\
          WHERE id='${req.body.id}'`, (err, data) => {
            if (err) {
              res.status(500).send(err).end();
            } else {
              res.redirect('/admin/banner');
            }
          });
      }
    }
  });
  return router;
}