var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' });
var mongo = require('mongodb');
var db= require('monk')('localhost/nodeblog');

router.get('/show/:id',(req,res,next)=>{
  var posts=db.get('posts');
  posts.findById(req.params.id,(err,post)=>{
    res.render('show',{
      'post': post
    });
  });
});

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

});
router.post("/addcomment",function(req,res,next){
  var name=req.body.name,
      email=req.body.email,
      body=req.body.body,
      postid=req.body.postid;
      commentdate=new Date();
  
  //Form Validation
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('email','Email field is required but never displayed').notEmpty();
  req.checkBody('email','Email is not formatted properly').isEmail();
  req.checkBody('body',"Body is required").notEmpty();

  //check errors
  var errors=req.validationErrors();
  if(errors)
  {
    var posts=db.get('posts');
    posts.findById(postid,(err,post)=>{
      res.render('show',{
        "errors": errors,
        "post": post
      });
    });
  }
  else{
    var comment={
      "name": name,
      "email": email,
      "body": body,
      "commentdate": commentdate
    }
    var posts=db.get('posts');
    posts.update({
      "_id": postid
    },{
      $push:{
        "comments": comment
      }
    },function(err,doc){
      if(err)
      {
        throw err;
      }
      else{
        req.flash('success','Commnet added');
        res.location("/pots/show/"+postid);
        res.redirect("/posts/show/"+postid);
      }
    });
  }

});
module.exports = router;
