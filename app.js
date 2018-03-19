var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds235328.mlab.com:35328/finder');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error'));
db.on('open', function() { console.log("The database is now connected"); });

var index = require('./routes/index.js');
var users = require('./routes/users.js');
var agency = require('./routes/agency.js');
var project = require('./routes/project.js');
var pole = require('./routes/pole.js');
var plan = require('./routes/plan.js');

// init
var app = express();

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    name: 'finder.sess',
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000*60*15 }
}));
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

///Set routes
app.use('/', index);
app.use('/user', users);
app.use('/agency', agency);
app.use('/project', project);
app.use('/pole', pole);
app.use('/plan', plan);

//Set Port
app.set('port', (process.env.PORT || 2727));
app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});
