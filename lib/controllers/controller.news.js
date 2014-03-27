(function() {
    'use strict';
    var News = require('../models/news');
    /**
     * Team Controller
     */
    exports.news = function(req, res) {
        News.find(function(err, news) {
            if (!err) {
                res.json(news);
            }
            else {
                console.log(err);
            }
        });
    };
    exports.createNews = function(req, res) {
        var reqObj = req.body;
        var news = new News({
            title: reqObj.title,
            author: reqObj.author,
            body: reqObj.body
        });
        news.save(function(err) {
            if (!err) {
                res.json(true);
            } else {
                res.json(false);
            }
        });
        return res.jsonp(req.body);
    };
    exports.deleteNews = function(req, res) {
        var id = req.params.newsId;
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
    };
}).call(this);