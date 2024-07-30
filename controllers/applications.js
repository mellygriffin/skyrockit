const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

//EVERYTHING STARTS WITH '/users/:userId/applications'

//GET '/user/:userId/applications
router.get('/', async (req, res) => {
    try {
        //look up user from req.session
    const currentUser = await User.findById(req.session.user._id); 
    //pass all current user's data in the context object   
    res.render('applications/index.ejs', {
        applications: currentUser.applications,
    });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

//GET /new
router.get('/new', async (req, res) => {
    res.render('applications/new.ejs');
});

//GET /:applicationId
router.get('/:applicationId', async (req, res) => {
    try {
        //look up user from req.session
        const currentUser = await User.findById(req.session.user._id);
        //find application by Id
        const application = currentUser.applications.id(req.params.applicationId);
        //render the view, passing the app data
        res.render('applications/show.ejs', {
            application: application,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

//POST /applications
router.post('/', async (req, res) => {
    try {
        //look up current user from session
        const currentUser = await User.findById(req.session.user._id);
        //push req.body to the applications array of the user
        currentUser.applications.push(req.body);
        //save changes to user
        await currentUser.save();
        //redirect to applications index
        res.redirect(`/users/${currentUser._id}/applications`);
    } catch (error) {
        //if any errors, log them and go home
        console.log(error);
        res.redirect('/')
    }
    });

//POST delete application route
router.delete('/:applicationId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.applications.id(req.params.applicationId).deleteOne();
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/applications`);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

//GET edit application route
router.get('/:applicationId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const application = currentUser.applications.id(req.params.applicationId);
        res.render('applications/edit.ejs', {
            application: application,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

//PUT update application route
router.put('/:applicationId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const application = currentUser.applications.id(req.params.applicationId);
        application.set(req.body);
        await currentUser.save();
        res.redirect(
            `/users/${currentUser._id}/applications/${req.params.applicationId}`
        );
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});

module.exports = router;