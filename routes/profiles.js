'use strict';

const router = require('express').Router();
const db = require('../lib/db');
const flash = require('../lib/flashHelper');


//Frontpage redirect
router.route('/')
    .get((request, response) => {
        response.redirect('/home/');
    });

//Home
router.route('/home')
    .get((request, response) => {
        response.render('home');
    });

//CREATE
router.route('/profile/create')
    .get((request, response) => {
        response.render('profiles/creates');
    })
    .post((request, response) => {

    });


//READ all
router.route('/profiles/')
    .get((request, response) => {
        //ADD Get-all profiles from database here.
        db.getAllProfiles()
            .then(function (data) {
                response.render('profiles/index', {allProfiles: data});
            })
            .catch(function (err) {
                console.log(err);
            })
    });

//READ specific
router.route('/profile/:user')
    .get((request, response) => {
        //Find profile by this ID later.
        var user = request.params.user;
        var profile;
        db.getProfile(user)
            .then(function (data) {
                profile = data[0];
                response.render('profiles/profile', {profile: profile});
            })
            .catch(function (err) {
                console.log(err);
            })
    });


//UPDATE
router.route('/profile/update/:user')
    .get((request, response) => {
        //Pass profile to template
        response.render('profiles/update');
    })
    .post((request, response) => {
        var username = request.params.user;
        var user = {
            username: request.body.username,
            password: request.body.password,
            age: request.body.age,
            band: request.body.band,
            type: request.body.type,
            skill: request.body.skill,
            genre: request.body.genre,
            phone: request.body.phone,
            email: request.body.email
        };
        db.updateUser(username, user);
        response.redirect('/profiles/');
    });

//DELETE
router.route('/profile/delete/:user')
    .get((request, response) => {
        response.render('profiles/delete');
    })
    .post((request, response) => {
        db.deleteUser(request.params.user);
        response.redirect('/profiles/');

    });

// MATCH USER
router.route('/profiles/matchuser')
    .get((request, response) => {
        response.render('profiles/matchuser');
    })
    .post((request, response) => {
        var user;
        if(request.app.locals.user) {       //If logged in
            user = request.app.locals.user;
        } else {
            user = request.body.username;
        }
        db.matchUser(user, request.body.attribute)
            .then(function (data) {
                if(!data) {
                    flash(request,'fail','No such user.');
                    response.redirect('/profiles/matchuser');
                } else {
                    response.render('profiles/index', {allProfiles: data});
                }
            })
            .catch(function (err) {
                console.log(err);
            });

    });


module.exports = router;
