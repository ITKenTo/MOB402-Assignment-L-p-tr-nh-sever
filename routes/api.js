var express = require('express');
var router = express.Router();
var apiU = require('../controller/api/api-user');
var apiP= require('../controller/api/api-product');

//Get /api/users
router.get('/users', apiU.listUser);// lấy ds

router.post('/users', apiU.addUser);// add ds

router.post('/users/:idu', apiU.updateUser);

router.delete('/users/:idu', apiU.deleteUser);

router.post('/users/login', apiU.loginUser);


///api produtc

router.get('/product', apiP.listProduct );

router.post('/product', apiP.AddProduct);

router.delete('/product/:id', apiP.deleteProduct);

router.put('/product/:id', apiP.updateProduct);

router.get('/product/chitiet', apiP.ChitietProduct);

module.exports = router;