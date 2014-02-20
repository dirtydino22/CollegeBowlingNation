'use strict';
/**
 * Routes Config
 */
var index = require('./handlers'),
    templates = require('./handlers/templates'),
    api = require('./resources/api'),
    auth = require('./resources/auth'),
    mail = require('./resources/mail');

// routes
module.exports = function(app) {
	// index
    app.get('/', index.index);
    // templates
    app.get('/templates/:fileName', templates.index);
    // API
    app.namespace('/api', function () {
    	// api/status
        app.get('/status', api.status);
    });
};