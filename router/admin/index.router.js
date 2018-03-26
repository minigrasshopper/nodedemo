const express = require('express');

module.exports = function () {
  var router = express.Router();
  // invoked for any requests passed to this router
  router.use((req, res, next) => {
    if (!req.session['admin_id'] && req.path != '/login'){
      res.redirect('/admin/login');
    }else{
      next();
    }
  });

  router.get('/', (req, res) => {
    res.render('admin/index.ejs');
  });

  router.use('/login', require('./login.router')());
  router.use('/banner', require('./banner.router')());
  router.use('/custom', require('./custom.router')());
  return router;
}