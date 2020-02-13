var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db= require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
      res.render('addcategory',{
      'title': "Add Category"
  });
});
router.post("/add",function(req,res,next){
    var name=req.body.name;
    
    //Form Validation
    req.checkBody('name','Name field is required').notEmpty();

    //check errors
    var errors=req.validationErrors();
    if(errors)
    {
      res.render('addpost',{
        "errors": errors
      });
    }
    else{
      var categories=db.get('categories')
      categories.insert({
        "name": name
      },(err,category)=>{
        if(err)
        {
          res.send(err);
        }
        else
        {
          req.flash('success','Category Addedd');
          res.location('/');
          res.redirect('/');
        }
      })
    }
  
  });

module.exports = router;
