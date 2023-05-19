const myModel= require('../../model/productmodel');

exports.listProduct= async (req,res,next)=>{
    let dataReturn= {
        status:1,
        msg:'ok'
    }

    let list=[];
    try {
        list= await myModel.productModel.find(). 
        populate("id_category") ;
        dataReturn.data= list;

    } catch (error) {
        dataReturn.msg=error.message;
    }
    res.json(dataReturn);
}

exports.AddProduct = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }

    if (req.method == "POST") {
        let product = myModel.productModel();
        product.name = req.body.name;
        product.id_category = req.body.id_categoy;
        product.content = req.body.content;
        product.price = req.body.price;
        product.image = req.body.image;

        try {
            let new_Product = await product.save();
            console.log(new_Product);
            dataReturn.data=new_Product;
            msg = 'Sản Phẩm Đã Thêm Thành Công'
            // res.redirect('/product/product')
        } catch (error) {
            console.log(error);
           dataReturn.msg = "Lỗi" + error.message;
        }
    }
    res.json(dataReturn);
}

exports.deleteProduct = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }

    try {
        const productId = req.params.id;
        // Tìm và xóa sản phẩm từ cơ sở dữ liệu
        const deletedProduct = await myModel.productModel.findOneAndDelete({ _id: productId });
        if (!deletedProduct) {
            dataReturn.msg="không tìm thấy sản phẩm"
        }
        dataReturn.msg="xóa sản phẩm thành công";
        dataReturn.data=deletedProduct
    } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
         dataReturn.msg="Lỗi khi xóa sản phẩm";
    }

    res.json(dataReturn);
}

exports.updateProduct = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }

    const productId = req.params.id;
    const updatedProduct = req.body;

    // Cập nhật sản phẩm trong MongoDB
    myModel.productModel.findByIdAndUpdate(productId, updatedProduct, { new: true })
        .then(product => {
            if (!product) {
                dataReturn.msg= 'Không tìm thấy sản phẩm';
            }
           // res.json(product);
           dataReturn.data=product;
        })
        .catch(err => {
            res.status(500).json({ message: 'Lỗi server', error: err });
        });

    res.json(dataReturn);
}


exports.ChitietProduct = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }
 let dieukien = null;
    if (typeof (req.query._id) != 'undefined') {
        dieukien = { username: req.query._id }
    }
    let list = [];
    try {
        list = await myModel.productModel.find(dieukien).
            populate("id_category");
            console.log(list);
        dataReturn.data = list;

    } catch (error) {
        dataReturn.msg = error.message;
    }
    res.json(dataReturn);
}