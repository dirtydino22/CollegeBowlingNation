'use strict';
/**
 * Module Dependecies
 */
var IndexCtrl = require('../controllers/controller.index'),
    TemplateCtrl = require('../controllers/controller.template'),
    BowlerCtrl = require('../controllers/controller.bowler'),
    TeamCtrl = require('../controllers/controller.team'),
    PostCtrl = require('../controllers/controller.post'),
    AuthCtrl = require('../controllers/controller.auth'),
    MailCtrl = require('../controllers/controller.mail'),
    passport = require('passport');

/**
 * Routes Config
 */
module.exports = function(app) {
    // index
    app.get('/', IndexCtrl.index);
    // templates
    app.get('/templates/:fileName', TemplateCtrl.template);
    // registration
    app.post('/register', AuthCtrl.register);

    /**
     * Mail Routes
     */
    app.post('/mailout', MailCtrl.send);
    app.post('/mailreply', MailCtrl.reply);

    /**
     * Authorization Routes
     */
     app.post('/login', passport.authenticate('local'), AuthCtrl.login);
     app.get('/loggedin', AuthCtrl.loggedIn);
     app.post('/logout', AuthCtrl.logout);

    /**
     * API Routes
     */
    // api namespace
    app.namespace('/api', function () {
    	// api/status
        app.get('/status', function(req, res) {
	        res.json(200, 'Status OK');
        });

        // api/posts namespace
        app.namespace('/posts', function() {
            // api/posts
            app.get('/', PostCtrl.posts);
            app.post('/', PostCtrl.createPost);
            // api/posts/:postId
            app.get('/:postId', PostCtrl.post);
            app.put('/:postId', PostCtrl.updatePost);
            app.delete('/:postId', PostCtrl.deletePost);
            // api/posts/:postId/reply
            app.post('/:postId/reply', PostCtrl.postReply);
        });

        // api/bowlers namespace
        app.namespace('/bowlers', function() {
            // api/bowlers
            app.get('/', BowlerCtrl.bowlers);
            app.post('/', BowlerCtrl.createBowler);
            // api/bowlers/:bowlerId
            app.get('/:bowlerId', BowlerCtrl.bowler);
            app.put('/:bowlerId', BowlerCtrl.updateBowler);
            app.delete('/:bowlerId', BowlerCtrl.deleteBowler);
        });

        // api/teams namespace
        app.namespace('/teams', function() {
            // api/teams
            app.get('/', TeamCtrl.teams);
            app.post('/', TeamCtrl.createTeam);
            // api/teams/:teamId
            app.get('/:teamId', TeamCtrl.team);
            app.put('/:teamId', TeamCtrl.updateTeam);
            app.delete('/:teamId', TeamCtrl.deleteTeam);
        });
    });
};
