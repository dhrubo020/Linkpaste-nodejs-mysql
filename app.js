/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : '',
              database : 'linkpaste'
            });
 
connection.connect();
 
global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//-----use--------
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 3600000*24*90 }
            }));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});

app.get('/',routes.call_index);

app.get('/login',routes.call_index);
app.post('/login',user.call_login);

app.get('/signup',user.call_signup);
app.post('/signup',user.call_signup);

app.post('/send',user.call_send);

app.get('/logout',user.logout);
//------------------admin end---------------------
app.listen(8080)
