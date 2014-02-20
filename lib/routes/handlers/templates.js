'use strict';
/**
 * GET templates
 */

exports.index = function(req, res) {
    var fileName = req.params.fileName;
    res.render('templates/' + fileName);
};