'use strict';

const router = require('express').Router();
const db = require('../lib/db');

//LOGIN

router.route('/login/')
    .get(function(req,res) {
        res.render('auth/login');
    })
    .post(function(req,res) {

    });

//REGISTER
router.route('/register/')
    .get(function(req,res) {
        res.render('auth/register');
    })
    .post(function(req,res) {

        var user = {
            username : req.body.username,
            password : req.body.password,
            age : req.body.age,
            band : req.body.band
        };
        console.log('tryna insert');
        console.log(user);

        db.insertUser(user);

        res.redirect('/')
    });

module.exports = router;