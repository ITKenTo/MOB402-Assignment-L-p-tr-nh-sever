exports.RequestLogin= (req,res,next)=> {
    if (req.session.userLogin){
        //nếu tồn tại thông tin user đã đăng nhập
        next();
    }else{
        res.redirect('/users/login');
    }
}

exports.NoRequestLogin=(req,res,next)=>{
    if (!req.session.userLogin) {
        next();
    }else{
        res.redirect('/');
    }
}