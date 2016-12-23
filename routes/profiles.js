'use strict';

const router = require('express').Router();


router.route('/profiles/')
    .get((request, response) => {
        //ADD Get-all profiles from database here.
       response.render('profiles/index')
    });


reouter.route('/profile/:id')
    .get((request, response) => {
        //Find profile by this ID later.
        var requestedId = request.params.id;

        //Pass found user to the template here.
        response.render('profiles/profile');
    });


router.route('/profile/create')
    .get((request, response) => {
        response.render('profiles/creates');
    })
    .post((request,response) => {
        
    });