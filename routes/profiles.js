'use strict';

const router = require('express').Router();
const db = require('../lib/db');



//CREATE
router.route('/profile/create')
    .get((request, response) => {
        response.render('profiles/creates');
    })
    .post((request,response) => {

    });


//READ all
router.route('/profiles/')
    .get((request, response) => {
        //ADD Get-all profiles from database here.
        var allProfiles = db.getAllProfiles();
        response.render('profiles/index', {allProfiles : allProfiles});
    });


//READ specific
router.route('/profiles/:user')
    .get((request, response) => {
        //Find profile by this ID later.
        var user = request.params.user;
        var profile;
        db.getProfile(user).then(function(data){
          profile = data;
          response.render('profiles/profile', {profile : profile});
        });
    });


//UPDATE
router.route('/profile/update/:id')
    .get((request,response) => {
        var id = request.params.id;
        //Select by id
        //Pass profile to template
        response.render('profiles/update');
    })
    .post((request,response) =>  {

    });

//DELETE
router.route('/profile/delete/:id')
    .get((request,response) => {
        response.render('snippets/delete');
    })
    .post((request,response) => {

    });


module.exports = router;
