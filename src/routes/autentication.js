const express = require("express");
const router = express.Router();
const pool = require("../databases");
const passport = require("passport");
router.get('/signup',(req,res) => {
        res.render('login');
});

router.post('/signup',(req,res,next) => {
        req.check('username','Username is Required').notEmpty;
        req.check('password','Password is Required').notEmpty;
        const errors = req.validationErrors();
        if (errors.leght > 0) {
                req.flash('message', errors[0].msg);
                res.redirect('/signun');
        }
        passport.authenticate('local.signin', {
                successRedirect: '/profile',
                failureRedirect: '/signup',
                failureFlash: true
        })(req, res, next);
});


router.get('/signin' , (req,res) => {
        res.render('signin');
});

router.post('/signin' , passport.authenticate('local.signup',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
}));

router.get('/profile',(req,res) => {
        res.render('profile');
});

module.exports = router;