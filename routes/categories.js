var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db= require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
      res.render('addcategory',{
      'title': "Add Category"
  });
});

module.exports = router;
