"use strict";
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./lib/db.js');



var path = require('path');

const app = express();
const port = process.env.PORT || 8000;

//Configurations
var hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
        ifCond: function (con1, operator, con2, options) {
            if (operator == '==') {
                return (con1 == con2) ? options.fn(this) : options.inverse(this);
            } else {
                return options.inverse(this);
            }
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


 //Session
 app.use(session({
 name: "supersecretsession1234abcdefgh",
 secret: "K7sm1m9Ms123ab89wEzVpjgjCep2s", // should be kept secret
 saveUninitialized: false,
 resave: false,
 cookie: {
 secure: false, // No HTTPS
 httpOnly: true, // Client script cannot mess with cookie
 maxAge: 1000 * 60 * 60 * 24
 }
 }));


//Flash
app.use(function (request, response, next) {
    if (request.session.flash) {
        response.locals.flash = request.session.flash;
        delete request.session.flash;
    }
    next();
});

//keep username
app.use(function (request, response, next) {
    app.locals.user = request.session.user;
    request.app.locals.user = request.session.user;     //For match functon
    app.locals.loggedin = request.session.loggedin;
    next();
});

//Static

app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/profiles'));


//errors
app.use((request, response) => response.status(404).render('404'));

app.use((err, req, res) => {
    //console.error(err.stack);
res.status(500).render("500");
});

console.log(app.listen(port, () => console.log('Listening to ' + port)));
/*console.log('1');
db.connect();
console.log('2');
db.createTables();
console.log('3');
db.printUserTable();
console.log('4');*/
db.initDB();
