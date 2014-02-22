'use strict';
/**
 * Module Dependecies
 */
var index = require('./handlers'),
    templates = require('./handlers/templates'),
    api = require('./resources/api'),
    auth = require('./resources/auth'),
    mail = require('./resources/mail'),
    passport = require('passport');

/**
 * Routes Config
 */
module.exports = function(app) {
    // index
    app.get('/', index.index);
    // templates
    app.get('/templates/:fileName', templates.index);
    // registration
    app.post('/register', auth.register);

    /**
     * Mail Routes
     */
    app.post('/mailout', mail.send);
    app.post('/mailreply', mail.reply);

    /**
     * Authorization Routes
     */
     app.post('/login', passport.authenticate('local'), auth.login);
     app.get('/loggedin', auth.loggedIn);
     app.post('/logout', auth.logout);

    /**
     * API Routes
     */
    // api namespace
    app.namespace('/api', function () {
    	// api/status
        app.get('/status', api.status);

        // api/posts namespace
        app.namespace('/posts', function() {
            // api/posts
            app.get('/', api.posts);
            app.post('/', api.createPost);
            // api/posts/:postId
            app.get('/:postId', api.post);
            app.put('/:postId', api.updatePost);
            app.delete('/:postId', api.deletePost);
            // api/posts/:postId/reply
            app.post('/:postId/reply', api.postReply);
        });

        // api/bowlers namespace
        app.namespace('/bowlers', function() {
            // api/bowlers
            app.get('/', api.bowlers);
            app.post('/', api.createBowler);
            // api/bowlers/:bowlerId
            app.get('/:bowlerId', api.bowler);
            app.put('/:bowlerId', api.updateBowler);
            app.delete('/:bowlerId', api.deleteBowler);
        });

        // api/teams namespace
        app.namespace('/teams', function() {
            // api/teams
            app.get('/', api.teams);
            app.post('/', api.createTeam);
            // api/teams/:teamId
            app.get('/:teamId', api.team);
            app.put('/:teamId', api.updateTeam);
            app.delete('/:teamId', api.deleteTeam);
        });
    });
};
