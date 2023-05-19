const myModel = require('../model/usermodel');
const brcypt = require('bcrypt');



exports.Register = async (req, res) => {
    let msg = '';


    if (req.method == 'POST') {

        if (req.body.password != req.body.password2) {
            msg = 'Mật khẩu không trùng khớp';
            return res.render('./login_register/register', { msg: msg });
        }
        try {
            let user = new myModel.userModel();
            user.username = req.body.username;
            user.fullname = req.body.fullname;
            user.email = req.body.email;

            //tạo chuỗi bí mật 
            const salt= await brcypt.genSalt(20);
            console.log("chuỗi ngẫu nhiên"+salt);
            user.password= await brcypt.hash(req.body.password, salt);
           // user.password = req.body.password;
            user.manage = 'KH'
            user.image = 'avt.jpg'
            let new_user = await user.save();
            console.log(new_user);
            msg = 'Đăng kí Thành Công'
        } catch (error) {
            console.log(error);
        }
    }
    res.render('./login_register/register', { title: 'Register', msg: msg });
    // res.render('./login_register/login', { title: "Login", msg: msg });
}


exports.Login = async (req, res, next) => {
    let msg = "";

    if (req.method == "POST") {
        console.log(req.body);
        try {
            let objU = await myModel.userModel.findOne({ username: req.body.username });

            if (objU != null) {
                if (objU.manage == "Admin") {
                    let checkpass = await brcypt.compare(req.body.passwd, objU.password);
                    if (checkpass) {
                        req.session.userLogin = objU;
                        console.log('Đăng nhập thành công');
                        return res.redirect('/');
                    } else {
                        msg = "Sai Mật Khẩu";
                    }
                } else {
                    msg = "Chỉ tài khoản Admin mới đăng nhập được"
                }
            } else {
                msg = "Không tồn tại tài khoản";
            }
        } catch (error) {
            msg = "Lỗi" + error.message;
        }
    }
    res.render('login_register/login', { title: 'Login', msg: msg });
}


exports.listuser = async (req, res) => {

    let dieukien = null;
    if (typeof (req.query.username) != 'undefined') {
        dieukien = { username: req.query.username }
    }

    var listusers = await myModel.userModel.find(dieukien);

    // const jsonData = JSON.stringify(listusers);
    // res.send(jsonData);
    res.render("users/user", { title: "Users", listusers: listusers });
}

exports.edituser = async (req, res) => {
    let objEdit = req.session.userLogin;

    console.log("id là "+objEdit._id);

    if (req.method=="POST") {
        let user= myModel.userModel();
        user.username=req.body.username;
        user.fullname=req.body.fullname;
        user.email=req.body.email;
        ///
        const salt = await brcypt.genSalt(20);
        console.log("chuỗi ngẫu nhiên" + salt);
        user.password = await brcypt.hash(req.body.passwd, salt);
        
       
        user.manage=req.body.manage;
        user.image= 'avt.jpg';
        user._id=req.params.id;

        try {
            console.log(req.body);
            await myModel.userModel.findByIdAndUpdate(req.params.id, user, { new: true });
            msg="Cập nhật thành công";
            req.session.userLogin=user;
            res.redirect('/users/profile');
        } catch (error) {
            console.log(error);
        }
    }

    res.render("users/edit_user", { title: "Edit User", objEdit:objEdit });
}



exports.deleteUser = async (req, res) => {
    let msg = "";
    try {
        let id = req.params.id;
        var user_dlt = await myModel.userModel.findById(id);

        if (user_dlt.manage == "Admin") {
            return res.status(400).send('Không thể xóa tài khoản Admin. Vui lòng nhấn phím back để quay lại');
        } else {
            var delete_user = await myModel.userModel.findByIdAndDelete(id);
            if (!delete_user) {
                console.log("Thất Bại");
            }
            res.redirect('/users/user');
        }
   

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

exports.profile = (req, res) => {
    let obj = req.session.userLogin;
    res.render("users/profile", { title: "Profile", obj: obj });
}

////get all json 

exports.getUserJson= async(req,res,next)=>{
    let dieukien = null;

    if (typeof (req.query.username) != 'undefined') {
        let username = req.query.username;
        dieukien = { username: username }
    }
    
    var user= await myModel.userModel.find(dieukien).lean();

    res.send(user);
}


exports.Logout= (req,res,next) =>{
    req.session.userLogin=null;
    res.redirect('/users/login');
}



