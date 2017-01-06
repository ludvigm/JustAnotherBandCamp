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
            age      : req.body.age,
            band     : req.body.band
        };

        var instrument = {
            type  : req.body.type,
            skill : req.body.skill
        }

        var interest = {
            genre : req.body.genre
        }

        var contact = {
            phone : req.body.phone,
            email : req.body.email
        }

        db.registerUser(user, instrument, interest, contact);
        res.redirect('/')
    });

module.exports = router;
