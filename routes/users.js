var express = require('express');
var router = express.Router();
var usersCTL = require('../controller/users.controller');
var check= require('../middleware/checklogin');
/* GET users listing. */

var multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function name(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({
    storage: storage,

}).single('image');


router.get('/register', check.NoRequestLogin, usersCTL.Register);
router.post('/register',check.NoRequestLogin ,usersCTL.Register);

router.get('/user',check.RequestLogin,usersCTL.listuser);

router.get('/profile',check.RequestLogin, usersCTL.profile);

router.get('/edit_user/:id', usersCTL.edituser);
router.post('/edit_user/:id', usersCTL.edituser);

// router.post('/updateavt/:id',upload, usersCTL.updateAvt);

router.get('/deleteuser/:id', usersCTL.deleteUser);

//Json 
router.get('/getUserJson', usersCTL.getUserJson);

///
router.get('/login', check.NoRequestLogin, usersCTL.Login);
router.post('/login',check.NoRequestLogin, usersCTL.Login);

router.get('/logout',usersCTL.Logout);


module.exports = router;
