var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter= require('./routes/product');
var apiRouter= require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("uploads"));

//session
app.use(session({
  secret: process.env.KEY_SESSION, //chuỗi kí tự đặc biệt để Session mã hóa, tự viết 
  resave: true,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product/', productRouter);
app.use('/api',apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  if (req.originalUrl.indexOf('/api') == 0) {

    // link bắt đầu bằng api là try cập vài trang API 
    res.json({
      status: 0,
      msg: err.message,
    });
  } else {
    res.render('error');
  }
  // render the error page
 // res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
