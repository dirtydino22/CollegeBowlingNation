'use strict';

var api = require('../controllers/api'),
    index = require('../controllers'),
    users = require('../controllers/users'),
    tempUser = require('../controllers/tempuser'),
    news = require('../controllers/news'),
    blog = require('../controllers/blog'),
    teams = require('../controllers/teams'),
    prospects = require('../controllers/prospects'),
    session = require('../controllers/session'),
    settings = require('../controllers/settings'),
    middleware = require('../middleware');

/**
 * Application routes
 */
module.exports = function(app) {
  // Setup Routes *unavailble after init setup
  app.route('/api/setup')
    .get(settings.init)
    .post(settings.setup);

  // Server API Routes
  app.route('/api/status')
    .get(api.status);

  app.route('/api/tempusers')
    .post(tempUser.create)
    .get(tempUser.list);
  app.route('/api/tempusers/:handle/:id')
    .post(tempUser.handle);

  app.route('/api/users')
    .get(users.list)
    .post(users.create);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/forgot')
    .post(users.forgotPassword);
  app.route('/api/users/:id')
    .get(users.show)
    .put(users.updateAccount)
    .delete(users.remove);
  app.route('/api/users/:id/changepassword')
    .put(users.changePassword);
  app.route('/api/users/:id/roster')
    .get(users.roster);
  app.route('/api/users/:id/newseason')
    .get(users.newSeason);
  app.route('/api/users/:id/bowler')
    .post(users.addBowler);
  app.route('/api/users/:id/bowler/:bowlerId')
    .post(users.newGame)
    .put(users.editBowler)
    .delete(users.removeBowler);

  app.route('/api/news')
    .get(news.list)
    .post(news.create);
  app.route('/api/news/:id')
    .put(news.update)
    .delete(news.remove);

  app.route('/api/blog')
    .get(blog.list)
    .post(blog.create);
  app.route('/api/blog/:id')
    .put(blog.update)
    .delete(blog.remove);
  app.route('/api/blog/:id/comment')
    .post(blog.addComment);
  app.route('/api/blog/:id/comment/:commentId')
    .delete(blog.removeComment);

  app.route('/api/newprospect')
    .post(prospects.newProspect);

  app.route('/api/teams')
    .get(teams.getTeams);
  app.route('/api/players')
    .get(teams.getPlayers);
  app.route('/api/players/:teamName')
    .get(teams.getTeamPlayers);
  app.route('/api/games')
    .get(teams.getGames);
  app.route('/api/teams/:teamName')
    .get(teams.getTeam);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js

  app.route('/partials/*')
    .get(index.partials);
  app.route('/modals/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};
