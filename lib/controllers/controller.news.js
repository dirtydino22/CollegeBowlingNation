(function() {
    'use strict';
    var News = require('../models/news');
    var jwt = require('jwt-simple');
    var payload = { access: 'api' };
    var secret = 'cbn';
    var token = jwt.encode(payload, secret);

    /**
     * Team Controller
     */
    exports.news = function(req, res) {
        if (req.params.token === token) {
            News.find(function(err, news) {
                if (!err) {
                    res.json(news);
                }
                else {
                    console.log(err);
                }
            });
        }
        else {
            return res.json('Unauthorized.');
        }
    };
    exports.createNews = function(req, res) {
        var reqObj = req.body;
        var news = new News({
            title: reqObj.title,
            author: reqObj.author,
            body: reqObj.body
        });
        if (req.params.token === token) {
            news.save(function(err) {
                if (!err) {
                    res.json(true);
                } else {
                    res.json(false);
                }
            });
            return res.jsonp(req.body);
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };
    exports.deleteNews = function(req, res) {
        var id = req.params.newsId;
        if (req.params.token === token) {
            if (id) {
                News.findById(id, function(err, news) {
                    if (!err) {
                        news.remove(function(err) {
                            if (!err) {
                                return res.send('');
                            } else {
                                console.log('Error removing news.');
                            }
                        });
                    } else {
                        console.log('Error retrieving news.');
                    }
                });
            } else {
                console.log('ID required to remove news.');
            }
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };
}).call(this);