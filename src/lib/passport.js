const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../databases');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    console.log(username);
    const rows = await pool.query("SELECT * FROM User WHERE User_Name = ?", [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password)
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {

    const rows = await pool.query("SELECT Id_User FROM User ORDER BY Id_User DESC LIMIT 1");
    var Id_User = rows[0].Id_User + 1;
    const { nickname, Email } = req.body;
    let newUser = {
        Id_User,
        Nick: nickname,
        User_Name: username,
        Email,
        password
    };
    console.log(newUser);
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO User SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.Id_User);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM User WHERE id_User = ?', [id]);
    done(null, rows[0]);
});