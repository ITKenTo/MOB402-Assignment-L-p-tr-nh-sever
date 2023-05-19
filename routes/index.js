var express = require('express');
var router = express.Router();
var check = require('../middleware/checklogin');


/* GET home page. */
router.get('/', check.RequestLogin, function(req,res, next){
  res.render('index',{title:"Home", profile:req.session.userLogin});
})

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

module.exports = router;
