
const { log } = require('console');
const myModel = require('../model/productmodel');
const fs = require('fs');
/////////////////////



/////Product
exports.AddProduct = async (req, res,next) => {
    let msg = "";
    let listCategory = await myModel.categoryModel.find();

    if (req.method == "POST") {
        let product = myModel.productModel();
        product.name = req.body.name;
        product.id_category = req.body.id_categoy;
        product.content = req.body.content;
        product.price = req.body.price;
        product.image = req.file.filename;

        try {
            let new_Product = await product.save();
            console.log(new_Product);
            msg = 'Sản Phẩm Đã Thêm Thành Công'
            req.session.tb = {
                type: 'success',
                message: "Thêm Thành công !"
            };
            // res.redirect('/product/product')
        } catch (error) {
            console.log(error);
            msg = "Lỗi" + error.message;
        }
    }


    res.render('product/addproduct', { title: "Add Product", listCategory: listCategory, msg:msg });
}


exports.Product = async (req, res) => {

    var listproduct = await myModel.productModel.find()
        .populate('id_category');

    var listcategory = await myModel.categoryModel.find();

   // res.render('product/product', { title: "Product", products: listproduct, listcategory: listcategory });
   res.send(listproduct);
}

exports.FillterProduct = async (req, res, next) => {

    var listcategory = await myModel.categoryModel.find();

    try {

        console.log(req.body.category);
        if (req.body.category == "") {
            var listproduct = await myModel.productModel.find()
                .populate('id_category');
        } else {
            var listproduct = await myModel.productModel.find({ id_category: req.body.category })
                .populate('id_category').lean();
        }

        res.render('product/product', { title: "Product", products: listproduct, listcategory: listcategory });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi máy chủ');
    }


}

exports.SearchPro = async (req,res)=>{
    let msg="";
    var listcategory = await myModel.categoryModel.find();
    let searchname= req.body.searchname;
    console.log(searchname);
    const regex = new RegExp(searchname, 'i');
    try {
        var listproduct = await myModel.productModel.find({ name: regex })
        .populate('id_category').lean();
    } catch (error) {
        msg="Lỗi"+error.message;
    }
   
    res.render('product/product', { title: "Product", products: listproduct, listcategory: listcategory });
     
}

exports.DeleteProduct = async (req, res) => {
    let mssg = "";
    var imagedel = await myModel.productModel.findById(req.params.id);

    try {
        let id = req.params.id;
        var product_dlt = await myModel.productModel.findByIdAndDelete(id);
      
        console.log(imagedel);
             fs.unlinkSync('./uploads/' + imagedel.image);
      
        if (!product_dlt) {
            mssg = "Thất Bại"
            console.log(mssg);
        } else {
            mssg = "Đã Xóa";
            res.redirect('/product/product');
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.EditProduct = async (req, res, next) => {
    let msg = "";
    let objProduct = await myModel.productModel.findById(req.params.idPd);

    let listCategory = await myModel.categoryModel.find();

    if (req.method == "POST") {

        let new_image = "";
        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync("./uploads/" + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        let productedit = myModel.productModel();
        productedit.name = req.body.name;
        productedit.id_category = req.body.id_categoy;
        productedit.content = req.body.content;
        productedit.price = req.body.price;
        productedit.image = new_image;
        productedit._id = req.params.idPd;

        try {
            console.log(req.body);
            await myModel.productModel.findByIdAndUpdate(req.params.idPd, productedit, { new: true });

            console.log("Đã ghi thành công");
            res.redirect('/product/product');
            //         msg = 'Đã ghi thành công';
        } catch (error) {
            console.log(error);
            msg = "Lỗi" + error.message;
        }
    }

    res.render('product/edit_product', { msg: msg, title: 'Edit Product', objProduct: objProduct, listCategory: listCategory });
}


///Chi tiêt sản phẩm
exports.Chitiet = async (req, res) => {

    let msg = "";
    let objProduct = await myModel.productModel.findById(req.params.id);
    let listCategory = await myModel.categoryModel.find();
    let namecategory = await myModel.categoryModel.findOne({ _id: objProduct.id_category });

    res.render('product/chitiet', { title: "Chi Tiết", objProduct: objProduct, listCategory: listCategory, namecategory: namecategory });
}
///Category
exports.AddCategory = (req, res) => {
    res.render('product/add_category', { title: 'Thêm Loại' })
}

exports.AddCategorypost = async (req, res) => {
    let msg = '';
    if (req.method == "POST") {
        let category = new myModel.categoryModel();
        category.name = req.body.name;
        try {
            var new_category = await category.save();
            console.log(new_category);
            msg = 'Đã Thêm Thể Loại';
        } catch (error) {
            console.log(error);
        }
    }
    res.redirect('/product/category');
}

exports.Category = async (req, res) => {
    var listcategory = await myModel.categoryModel.find();
    res.render('product/category', { title: "Category", listcategory: listcategory });
}

exports.deleteCategory = async (req, res) => {
    let msg = "";
    try {
        var check = await myModel.productModel.find({ id_category: req.params.id });
        if (check.length>0) {
            return res.status(400).send('Không thể xóa thể loại này vì có sản phẩm sử dụng nó.');
        } 
            await myModel.categoryModel.findByIdAndDelete(req.params.id);
            msg = "Xóa thành Công";
            res.redirect('/product/category');

    } catch (error) {
        console.log(error);
    }
}

exports.editCategory = async (req, res, next) => {
    let msg = "";
    var objCategory = await myModel.categoryModel.findById(req.params.idCT);

    if (req.method == "POST") {

        let categoryed = new myModel.categoryModel();
        categoryed.name = req.body.name;
        categoryed._id = req.params.idCT;

        try {
            console.log(req.body);
            await myModel.categoryModel.findByIdAndUpdate(req.params.idCT, categoryed, { new: true });
            msg = "Đã Cập Nhật";

            res.redirect('/product/category')
        } catch (error) {
            console.log(error);
        }
    }

    res.render('product/edit_Category', { title: "Edit Category", ObjCategory: objCategory });
}

exports.fillterCategory = async (req, res) => {

    if (req.method == "POST") {
        try {
            let fltCategory = await myModel.productModel.find({ id_category: req.body.id_category });
            console.log(fltCategory);
        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }
}

//trả file json

exports.getProductJson = async(req,res,next)=>{
    let product = await myModel.productModel.find().populate('id_category').lean();
    res.send(product);
}