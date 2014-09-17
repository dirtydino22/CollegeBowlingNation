var mongoose = require('mongoose'),
	News = mongoose.model('News');

exports.create = function(req, res) {
	var newNews = new News(req.body);
	newNews.save(function(err) {
		if (err) { return res.send(403); }
		return res.send(200);
	});
};

exports.list = function(req, res) {
	News.find(function(err, news) {
		if (err) { return res.send(403, err); }
		return res.json(200, news);
	});
};

exports.update = function(req, res) {
	var id = req.params.id;
	var info = req.body;
	News.findById(id, function(err, article) {
		if (err) { return res.send(400, err); }
		article.createdOn = info.createdOn;
		article.author = info.author;
		article.title = info.title;
		article.body = info.body;
		article.save(function(err) {
			if (err) { return res.send(400, err); }
			return res.send(200);
		});

	});
};

exports.remove = function(req, res) {
	var id = req.params.id;
	News.findById(id, function(err, news) {
		if (err) { return res.send(403, err); }
		news.remove(function(err) {
			if (err) { return res.send(403, err); }
			return res.send(200);
		});
	});
};

exports.updateSocket = function(io, socket) {
	return News.find(function(err, news) {
		if (err) { return socket.emit('error:nodata'); }
		return io.emit('news:update', news);
	});
};