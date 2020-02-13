var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var mongo = require('mongodb');
var db= require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
  var categories=db.get('categories');
  categories.find({},{},(err,categories)=>{
    res.render('addpost',{
      'title': "Add Post",
      'categories': categories
    });
  });
});
router.post("/add",upload.single('mainimage'),function(req,res,next){
  var title=req.body.title,
      category=req.body.category,
      body=req.body.body,
      author=req.body.author,
      date=new Date();
  if(req.file)
  {
    var mainimage=req.file.filename;
  }
  else
  {
    var mainimage='noimage.jpg'
  }

  //Form Validation
  req.checkBody('title','Title field is required').notEmpty();
  req.checkBody('body',"Body is required").notEmpty();

  //check errors
  var errors=req.validationErrors();
  if(errors)
  {
    res.render('addpost',{
      "errors": errors
    });
  }
  else{
    var posts=db.get('posts')
    posts.insert({
      "title": title,
      "body": body,
      "category": category,
      "date": date,
      "author": author,
      "mainimage": mainimage
    },(err,post)=>{
      if(err)
      {
        res.send(err);
      }
      else
      {
        req.flash('success','Post Addedd');
        res.location('/');
        res.redirect('/');
      }
    })
  }

})

module.exports = router;
