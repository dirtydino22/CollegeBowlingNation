/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {


  app.use('/api/setup', require('./api/setup'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/tempusers', require('./api/tempuser'));
  app.use('/api/news', require('./api/news'));
  app.use('/api/blog', require('./api/blog'));
  app.use('/api/mail', require('./api/mail'));
  app.use('/api/reset', require('./api/reset'));
  app.use('/api/team', require('./api/team'));
  app.use('/api/prospects', require('./api/prospects'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
