const express = require('express');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
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
        conn.query(`SELECT * FROM custom_table`, (err, custom) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            conn.query(`SELECT * FROM custom_table WHERE id='${req.query.id}'`, (err, moddata) => {
              if (err) {
                res.status(500).send(err).end();
              } else {
                res.render('admin/custom.ejs', { custom: custom, moddata: moddata[0] });
              }
            });
          }
        });
        break;
      case 'delete':
        conn.query(`SELECT * FROM custom_table WHERE id='${req.query.id}'`, (err, data) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            if(!data.length){
              res.status(404).send('not find data').end();
              return false;
            }
            fs.unlinkSync('static/upload/' + data[0].src);
            conn.query(`DELETE FROM custom_table WHERE id='${req.query.id}'`, (err, data) => {
              if (err) {
                res.status(500).send(err).end();
              } else {
                res.redirect('/admin/custom');
              }
            }); 
          }
        })
        break;
      default:
        conn.query(`SELECT * FROM custom_table`, (err, data) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            res.render('admin/custom.ejs', { custom: data });
          }
        });
        break;
    }
  });
  router.post('/', (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    if (req.files.length){
      var ext = path.parse(req.files[0].originalname).ext;
      var oldfilename = req.files[0].filename;
      var oldpath = req.files[0].path;
      var newfilename = oldfilename + ext;
      var newpath = oldpath + ext;
      fs.renameSync(oldpath, newpath);
    }else{
      var newfilename = null;
    }
    if (!req.body.id) {
      // 添加
      if (!title || !description || !newfilename) {
        res.status(400).send('arg is error').end();
        return false;
      } 
      conn.query(`INSERT INTO custom_table (title,description,src) VALUES ('${title}','${description}','${newfilename}')`, (err, data) => {
        if (err) {
          res.status(500).send(err).end();
        } else {
          res.redirect('/admin/custom');
        }
      });
    } else {
      // 修改
      if (!title || !description) {
        res.status(400).send('arg is error').end();
        return false;
      } 
      if (!newfilename){
        // 不修改图片
        conn.query(`UPDATE custom_table SET\
        title='${title}',\
        description='${description}'\
        WHERE id='${req.body.id}'`, (err, data) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            res.redirect('/admin/custom');
          }
        });
      }else{
        // 1、删除以前的图片
        conn.query(`SELECT * FROM custom_table WHERE id='${req.body.id}'`, (err, data) => {
          if (err) {
            res.status(500).send(err).end();
          } else {
            fs.unlinkSync('static/upload/' + data[0].src);
            // 2、更新数据
            conn.query(`UPDATE custom_table SET\
              title='${req.body.title}',\
              description='${req.body.description}',\
              src='${newfilename}'\
              WHERE id='${req.body.id}'`, (err, data) => {
                if (err) {
                  res.status(500).send(err).end();
                } else {
                  res.redirect('/admin/custom');
                }
              });
          }
        })
      }
    }
  });
  return router;
}


