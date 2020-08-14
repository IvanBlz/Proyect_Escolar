const express = require("express");
const router = express.Router();
const pool = require('../databases');

const passport = require("passport");
const { isLoggedIn } = require('../lib/auth');

router.get('/signup', (req, res) => {
    res.render('auth/login');
});

router.post('/signup', (req, res, next) => {

    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    })(req, res, next);
});


router.get('/signin', isLoggedIn, (req, res) => {
    req.logOut();
    res.render('auth/signin');
});

router.post('/signin', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
}));

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/')
});


router.get('/profile', isLoggedIn, async(req, res) => {
    const Users = await pool.query('SELECT * FROM User WHERE Id_User = ?', [req.user.Id_User]);
    res.render('auth/profile', { Users });
});

router.get('/projects', isLoggedIn, async(req, res) => {
    const Customer = await pool.query('SELECT * FROM Customer');
    const projects = await pool.query('SELECT * FROM Project');
    const Users = await pool.query('SELECT * FROM User');
    res.render('auth/project', { projects, Customer, Users });
});


router.post('/projects', isLoggedIn, async(req, res) => {
    console.log(req.body);
    const { Customer, Responsible, Estimate, Project, date } = req.body;
    const NewProject = {
        Responsible,
        Customer,
        Name: Project,
        Date_Start: date,
        Date_End: date,
        Estimate,
        Total_Cost: '0.00'
    };
    console.log(NewProject);
    await pool.query('INSERT INTO Project set ?', [NewProject]);
    req.flash('success', 'Project Saved Successfully');
    res.redirect('/projects');
});

router.get('/task', isLoggedIn, async(req, res) => {
    const projects = await pool.query('SELECT * FROM Project');
    const Users = await pool.query('SELECT * FROM User');
    res.render('auth/task', { projects, Users });
});

router.get('/customer', isLoggedIn, async(req, res) => {
    const Customer = await pool.query('SELECT * FROM Customer');
    res.render('auth/Customer/Customer', { Customer });
});

router.post('/customer', isLoggedIn, async(req, res) => {
    const { Customer, email, RFC, Phone, Street, Colony, State, Zip_Code } = req.body;
    const NewCustomer = {
        Discharge: req.user.Id_Security,
        Name: Customer,
        Email: email,
        RFC,
        Phone,
        Street,
        Colony,
        State,
        Zip_Code
    };

    await pool.query('INSERT INTO Customer set ?', [NewCustomer]);
    res.redirect('/customer');
});

router.get('/security', isLoggedIn, async(req, res) => {
    const Users = await pool.query('SELECT * FROM User');
    res.render('auth/Security/Users', { Users });
});
module.exports = router;