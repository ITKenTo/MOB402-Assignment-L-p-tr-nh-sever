var express = require('express');
var router = express.Router();
var productCTL= require('../controller/product.controller');
var check = require('../middleware/checklogin');

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


//getproduct
router.get('/product',check.RequestLogin, productCTL.Product);
router.post('/fillter',check.RequestLogin, productCTL.FillterProduct);
router.post('/search',check.RequestLogin, productCTL.SearchPro);

////add product
router.get('/addproduct', productCTL.AddProduct);
router.post('/addproduct',upload, productCTL.AddProduct);

//edit product
router.post('/editproduct/:idPd',upload, productCTL.EditProduct);
router.get('/editproduct/:idPd', productCTL.EditProduct);

//chitiet product
router.get('/chitiet/:id', productCTL.Chitiet);
//delete product
router.get('/delete/:id', productCTL.DeleteProduct);

//addproduct
router.get('/addcategory', productCTL.AddCategory);
router.post('/addcategory', productCTL.AddCategorypost);

router.get('/category',check.RequestLogin ,productCTL.Category);
//
router.get('/deletecategory/:id',productCTL.deleteCategory);

//edit category
router.get('/editCategory/:idCT', productCTL.editCategory);
router.post('/editCategory/:idCT', productCTL.editCategory);

// file json API

router.get('/getProductJson', productCTL.getProductJson);

module.exports = router;

