(function() {
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
        UserCtrl = require('../controllers/controller.user'),
        TempUserCtrl = require('../controllers/controller.tempUser'),
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
        app.post('/register', TempUserCtrl.register);
        app.post('/registeradmin', UserCtrl.registerAdmin);

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
        app.namespace('/api', function() {
            // api/status
            app.get('/status', function(req, res) {
                res.json(200, 'Status OK');
            });


            // list of users or users
            // api/users
            app.get('/users', UserCtrl.list);



            // change user password
            // api/users/:userId
            app.post('/users/:userId', UserCtrl.updatePassword);
            // remove user
            // api/users/:userId/remove
            app.post('/users/:userId/remove', UserCtrl.remove);
            // api/tempUser namespace
            app.namespace('/tempusers', function() {
                // api/tempUser
                app.get('/', TempUserCtrl.list);
                // api/tempUser/:id/accept/:access
                app.get('/:id/accept/:access', TempUserCtrl.accept);
                // api/tempUser/:id/decline
                app.get('/:id/decline', TempUserCtrl.decline);
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
                app.post('/:bowlerId', BowlerCtrl.newGame);
                app.put('/:bowlerId', BowlerCtrl.updateBowler);
                app.delete('/:bowlerId', BowlerCtrl.deleteBowler);
            });

            // api/teams namespace
            app.namespace('/teams', function() {
                // api/teams
                app.get('/', TeamCtrl.teams);
                app.get('/:university', TeamCtrl.team);
                /*
                app.post('/', TeamCtrl.createTeam);

                app.get('/:teamId', TeamCtrl.team);
                app.put('/:teamId', TeamCtrl.updateTeam);
                app.delete('/:teamId', TeamCtrl.deleteTeam);
                */
            });
        });
    };

}());