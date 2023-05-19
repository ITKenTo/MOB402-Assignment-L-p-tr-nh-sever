const myModel = require('../../model/usermodel');
const brcypt = require('bcrypt');


exports.loginUser = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }

    let user = [];

    // if (req.method=="POST"){
        
  
    //     const { username, password } = req.body;

    //     try {
    //         console.log(req.body.username);
    //         // Tìm người dùng theo email
    //          user = await myModel.userModel.findOne({ username });

    //         if (!user) {
    //             dataReturn.msg="Không tìm thấy tài khoản";
    //         }
    //         const isPasswordMatch = await brcypt.compare(password, user.password);

    //         if (!isPasswordMatch) {
    //             dataReturn.msg= 'Mật khẩu không chính xác' ;
    //         }

    //         dataReturn.data = user;

    //         // Đăng nhập thành công
    //         // return res.status(200).json({ message: 'Đăng nhập thành công' });

    //     } catch (err) {
    //         console.error(err);
    //         return res.status(500).json({ msg: 'Có lỗi xảy ra' });
    //     }
    //     res.json(dataReturn);
    // }
    try {
        const user = await myModel.userModel
            .findByCredentials(req.body.username, req.body.passwd)
        if (!user) {
            return res.status(401)
                .json({ error: 'Sai thông tin đăng nhập' })
        }

        return res.status(200).json({ user})


    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: error.message })
    }
    // trả về clinet

}


exports.listUser = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }

    // code xủ lí ở dưới 
    let list = [];
    try {
        let dieukien = null;
        if (typeof (req.query.username) != 'undefined') {
            dieukien = { username: req.query.username }
        }
        list = await myModel.userModel.find(dieukien);
        dataReturn.data = list;

    } catch (error) {
        dataReturn.msg = error.message;
    }

    // trả về clinet
    res.json(dataReturn);
}

exports.addUser = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }

    // code xủ lí ở dưới 
    if (req.method == 'POST') {

        if (req.body.password != req.body.password2) {
            dataReturn.msg = 'Mật khẩu không trùng khớp';
        }
        try {
            let user = new myModel.userModel();
            user.username = req.body.username;
            user.fullname = req.body.fullname;
            user.email = req.body.email;

            //tạo chuỗi bí mật 
            const salt = await brcypt.genSalt(20);
            // console.log("chuỗi ngẫu nhiên" + salt);
            user.password = await brcypt.hash(req.body.password, salt);
            // user.password = req.body.password;
            user.manage = 'KH'
            user.image = 'avt.jpg'
            let data = await user.save();
            dataReturn.data=data;
            console.log(new_user);
            dataReturn.msg='Đằn Kí thành công'
        } catch (error) {
            dataReturn.msg= error.message;
        }
    }

    // trả về clinet
    res.json(dataReturn);
}

exports.updateUser = async (req, res, next) => {
    let dataReturn = {
        status: 1,
        msg: 'ok'
    }
     
    let id=  req.params.id;
   

    if (req.method == "PATCH") {
        try {
            
            let userU= myModel.userModel();
            userU._id= id;
            const salt = await brcypt.genSalt(10);
            const passwd = await brcypt.hash(req.body.newpassword, salt);
            
            let data = await myModel.userModel.findByIdAndUpdate({_id:id},{password: passwd }, {new:true});
            dataReturn.data=data;
            data.msg= "Cập nhật thành công"
         
        } catch (error) {
            dataReturn.msg=error.message;
        }
    }

    // code xủ lí ở dưới 


    // trả về clinet
    res.json(dataReturn);
}

exports.deleteUser = async (req, res, next) => {
    let data = {
        status: 1,
        msg: 'ok'
    }

    // code xủ lí ở dưới 
    try {
        const userId = req.params.idu;
        const user = await myModel.userModel.findByIdAndDelete(userId);

        // Nếu không tìm thấy user
        if (!user) {
            return data.msg="Không tìm thấy user";
        }

        // Trả về dữ liệu user đã xóa
    
        data.msg="Xóa thành công"
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        return res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }

    // trả về clinet
    res.json(data);
}