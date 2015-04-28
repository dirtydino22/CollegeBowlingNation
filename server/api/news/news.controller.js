'use strict';

var News = require('./news.model');

exports.index = function(req, res) {
	News.find(function(err, news) {
		if (!!err) return res.send(403);
		return res.json(200, news);
	});
};

exports.create = function(req, res) {
	var newNews = new News(req.body);
	newNews.save(function(err) {
		if (!!err) return res.send(403);
		return res.send(200);
	});
};

exports.update = function(req, res) {
	var updates = req.body;
	News.findById(req.params.id, function(err, article) {
		if (!!err) return res.send(403);
		article.createdOn = updates.createdOn;
		article.author = updates.author;
		article.title = updates.title;
		article.body = updates.body;
		article.save(function(err) {
			if (!!err) return res.send(401);
			return res.send(200);
		});
	});
};

exports.remove = function(req, res) {
	News.findById(req.params.id, function(err, news) {
		if (!!err) return res.send(403);
		news.remove(function(err) {
			if (!!err) return res.send(403);
			return res.send(200);
		});
	});
};

exports.updateSocket = function(socket) {
	News.find(function(err, news) {
		if (!!err) return socket.emit('error:nodata');
		return socket.emit('news:update', news);
	});
};