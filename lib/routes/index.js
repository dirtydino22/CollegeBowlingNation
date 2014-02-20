var index = require('./handlers'),
    partials = require('./handlers/partials'),
    resources = require('./resources/api');

module.exports = function(app) {
    app.get('/', index.index);
    app.get('/partials/:fileName', partials.index);
    
    app.namespace('/api', function () {
        app.get('/status', resources.status);
    });
};