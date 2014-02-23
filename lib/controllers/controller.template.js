'use strict';
/**
 * Template Controller
 */
exports.template = function(req, res) {
    var fileName = req.params.fileName;
    res.render('templates/' + fileName);
};