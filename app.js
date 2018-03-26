// cnpm install express cookie-parser cookie-session body-parser consolidate ejs multer mysql -D
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');

var app = express();
app.listen(8000);
// 配置cookie\session
app.use(cookieParser());
(function () {
  var keys = [];
  for (var i = 0; i < 10000; i++) {
    keys[i] = Math.random() + 'ant';  // 这里必须是字符串
  }
  app.use(cookieSession({
    name: 'session',
    keys: keys,
    maxAge: 24 * 60 * 60 * 1000
  }));
}())
// 配置静态文件
app.use(express.static('./static'));
// 配置模板渲染
app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', './template');
// enctype application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// enctype multipart/form-data
var upload = multer({ dest: './static/upload' });
app.use(upload.any());

// 配置路由
app.use('/admin', require('./router/admin/index.router')());
app.use('/web', require('./router/web/index.router')());


