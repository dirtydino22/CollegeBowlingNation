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
        NewsCtrl = require('../controllers/controller.news'),
        passport = require('passport'),
        cache = require('appcache-node');

    var manifest = cache.newCache([
        '/index.html',
        '/templates/account.html',
        '/templates/admin.html',
        '/templates/blog.html',
        '/templates/bowler.html',
        '/templates/main.html',
        '/templates/newgame.html',
        '/templates/prospects.html',
        '/templates/rankings.html',
        '/templates/replies.html',
        '/templates/scorecard.html',
        '/templates/modals/modal.contact.html',
        '/templates/modals/modal.login.html',
        '/templates/modals/modal.post.html',
        '/templates/modals/modal.team.html',
        '/libs/angular/angular.min.js',
        '/libs/d3/d3.min.js',
        '/libs/jquery.js',
        '/js/cbn.min.js',
        '/css/app.css',
        '/img/banner.gif'
    ]);

    /**
     * Routes Config
     */
    module.exports = function(app) {
        // index
        app.get('/', IndexCtrl.index);

        app.get('/app.manifest', function(req, res) {
            console.log('sending manifest');
            res.header('Content-Type', 'text/cache-manifest');
            res.end(manifest);
        });

        // templates
        app.get('/templates/:fileName', TemplateCtrl.template);

        // registration
        app.post('/register', TempUserCtrl.register);
        app.post('/registeradmin', UserCtrl.registerAdmin);

        /**
         * Mail Routes
         */
        app.post('/mail', MailCtrl.send);
        app.post('/mailtocoach', MailCtrl.sendToCoach);

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

            app.get('/users/:userId', UserCtrl.getUser);

            // change user password
            // api/users/:userId
            app.post('/users/:userId/password', UserCtrl.updatePassword);
            app.post('/users/:userId/info', UserCtrl.updateInfo);
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

            // api/news namespace
            app.namespace('/news', function() {
                // api/news
                app.get('/', NewsCtrl.news);
                app.post('/', NewsCtrl.createNews);
                // api/posts/:newsId
                app.delete('/:newsId', NewsCtrl.deleteNews);
            });

            // api/bowlers namespace
            app.namespace('/bowlers', function() {
                // api/bowlers
                app.get('/', BowlerCtrl.bowlers);
                app.post('/', BowlerCtrl.createBowler);
                // api/bowlers/:bowlerId
                app.get('/:bowlerId', BowlerCtrl.bowler);
                app.post('/:bowlerId', BowlerCtrl.newGame);
                app.post('/:bowlerId', BowlerCtrl.updateBowler);
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

}).call(this);