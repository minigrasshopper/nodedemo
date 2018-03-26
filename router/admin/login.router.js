const express = require('express');
const commonService = require('../../libs/common.service');
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
    res.render('admin/login.ejs');
  });
  router.post('/', (req, res) => {
    var username = req.body.username;
    var password = commonService.md5(req.body.password);
    conn.query(`SELECT * FROM admin_table WHERE username='${username}'`, (err, data) => {
      if (err) {
        res.status(500).send(err).end();
      } else {
        if (!data.length) {
          res.status(400).send('admin is not exsited').end();
        } else {
          if (data[0].password == password) {
            req.session.admin_id = data[0].id;
            res.redirect('/admin/');
          } else {
            res.status(400).send('password is error').end();
          }
        }
      }
    });
  });

  return router;
}