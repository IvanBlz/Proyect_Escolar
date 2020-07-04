const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const { database } = require('./conexion');
//initializations
const app = express();
require("./lib/passport");
//settings
//Parsear el body usando body parser
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario
app.set('port', process.env.PORT || 4000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir:  path.join(app.get('views'),'layout'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middleware
app.use(session({
    secret: 'DAWUP',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req, res, next) => {
    //app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    //app.locals.user = req.user;
    next();
});


//routes
app.use(require("./routes/index"));
app.use(require("./routes/autentication"));
app.use('/Nosotros',require('./routes/Nosotros'));
app.use('/Contacto',require('./routes/Contacto'));


//Public
app.use(express.static(path.join(__dirname, 'public')));


//starting


app.listen(app.get('port'), () => {
    console.log('server is in port', app.get('port'));
});