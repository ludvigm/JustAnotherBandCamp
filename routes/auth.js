'use strict';

const router = require('express').Router();
const db = require('../lib/db');
const flash = require('../lib/flashHelper');

//LOGIN

router.route('/login/')
    .get(function (req, res) {
        res.render('auth/login');
    })
    .post(function (req, res) {
        var input = {
            username: req.body.username,
            password: req.body.password
        };

        db.checkAuth(input)
            .then(function (result) {
                if (result) {
                    req.session.user = input.username;
                    req.session.loggedin = true;
                    flash(req, 'success', 'You are logged in as ' + input.username);
                    res.redirect('/')
                } else {
                    flash(req, 'fail', 'Incorrect credentials');
                    res.redirect('/login');
                }
            })
            .catch(function(err) {
                console.log(err);
            })
    });

//REGISTER
router.route('/register/')
    .get(function (req, res) {
        res.render('auth/register');
    })
    .post(function (req, res) {
        var user = {
            username: req.body.username,
            password: req.body.password,
            age: req.body.age,
            band: req.body.band
        };

        var instrument = {
            type: req.body.type,
            skill: req.body.skill
        }

        var interest = {
            genre: req.body.genre
        }

        var contact = {
            phone: req.body.phone,
            email: req.body.email
        };

        db.registerUser(user, instrument, interest, contact)
            .then(function (worked) {
                if (worked) {
                    flash(req, 'success', 'User registered! Login here.');
                    res.redirect('/login')
                } else {
                    flash(req, 'fail', 'Username exists already!');
                    res.redirect('/register');
                }
            })
            .catch(function (err) {
                console.log(err);
            })
    });

router.route('/logout')
    .get(function(req,res) {
        req.session.destroy();
        res.redirect('/');
    });

module.exports = router;
