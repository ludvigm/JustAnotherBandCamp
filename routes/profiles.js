'use strict';

const router = require('express').Router();
const db = require('../lib/db');


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
            .then(function(data) {
                response.render('profiles/index', {allProfiles: data});
            })
            .catch(function(err){
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
            .catch(function(err) {
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
            username : request.body.username,
            password : request.body.password,
            age      : request.body.age,
            band     : request.body.band,
            type     : request.body.type,
            skill    : request.body.skill,
            genre    : request.body.genre,
            phone    : request.body.phone,
            email    : request.body.email
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
      console.log('Selected attr: ' + request.body.attribute);
      console.log('Selected attr: ' + request.body.username);
      db.matchUser(request.body.username, request.body.attribute)
      .then(function(data) {
        response.render('profiles/index', {allProfiles: data});
      })
      .catch(function(err){
          console.log(err);
      });
    });


module.exports = router;
