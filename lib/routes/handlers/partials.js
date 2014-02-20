exports.index = function(req, res) {
    var fileName = req.params.fileName;
    res.render('partials/' + fileName);
};