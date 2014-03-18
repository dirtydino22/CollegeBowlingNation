(function() {
    'use strict';
    /**
     * Template Controller
     */
    /**
     * template
     * renders a template based on request
     */
    exports.template = function(req, res) {
        var fileName = req.params.fileName;
        res.render('templates/' + fileName);
    };
}());