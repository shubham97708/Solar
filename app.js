require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');
var soldbillproduct = require('./routes/soldbillproduct');
var returnbystore = require('./routes/returnbystore');
var store = require('./routes/store');
var brand = require('./routes/brand');
var model = require('./routes/model');
var feedstock = require('./routes/feedstock');
var stock = require('./routes/stock');
var transfers = require('./routes/transfers');
var sold = require('./routes/sold');
var returns = require('./routes/returns');
var search = require('./routes/search');
var dailyreport = require('./routes/dailyreport');
var demand = require('./routes/demand');
var categories = require('./routes/categories');
var backup = require('./routes/backup');
var loggedInUsers = require('./routes/loggedInUsers');
var appworkinghours = require('./routes/appworkinghours');
var api = require('./routes/api');
var privacypolicy = require('./routes/privacypolicy');
var storelogin = require('./routes/storelogin');
var addscheme = require('./routes/addscheme');
var sell = require('./routes/sell');
var customer = require('./routes/customer');
var vendor = require('./routes/vendor');
var vendorreturns = require('./routes/vendorreturns');
var download = require('./routes/download');
var employee = require('./routes/employee');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(cookieSession({
  name: 'inventory',
  keys: ['abhishek0058'],
  maxAge: 100 * 60 * 60 * 1000 // 24 hours
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/returnbystore',returnbystore)
app.use('/', indexRouter);
app.use('/user', user);
app.use('/soldbillproduct',soldbillproduct);
app.use('/download', download);
app.use('/admin', admin);
app.use('/store', store);
app.use('/brand', brand);
app.use('/model', model);
app.use('/feedstock', feedstock);
app.use('/stock', stock);
app.use('/transfers', transfers);
app.use('/sold', sold);
app.use('/returns', returns);
app.use('/search', search);
app.use('/dailyreport', dailyreport);
app.use('/demand', demand);
app.use('/categories', categories);
app.use('/backup', backup);
app.use('/loggedInUsers', loggedInUsers);
app.use('/appworkinghours', appworkinghours);
app.use('/privacypolicy', privacypolicy);
app.use('/storelogin', storelogin);
app.use('/addscheme', addscheme);
app.use('/sell', sell);
app.use('/customer', customer);
app.use('/vendor', vendor);
app.use('/vendorreturns', vendorreturns);
app.use('/employee', employee);

app.use('/api', api);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;