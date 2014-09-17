var mongoose = require('mongoose'),
	Blog = mongoose.model('Blog');

exports.create = function(req, res) {
	var newPost = new Blog(req.body);
	newPost.save(function(err) {
		if (err) { return res.send(403); }
		return res.send(200);
	});
};

exports.list = function(req, res) {
	Blog.find(function(err, posts) {
		if (err) { return res.send(403, err); }
		return res.json(200, posts);
	});
};

exports.updateSocket = function(io, socket) {
	Blog.find(function(err, posts) {
		if (err) { return socket.emit('error:nodata'); }
		return io.emit('posts:update', posts);
	});
};

exports.addComment = function(req, res) {
	var id = req.params.id;
	Blog.findById(id, function(err, post) {
		if (err) { return res.send(400, err); }
		post.comments.push(req.body);
		post.save(function(err) {
			if (err) { return res.send(400, err); }
			return res.send(200);
		});
	});
};

exports.update = function(req, res) {
	var id = req.params.id;
	var info = req.body;
	Blog.findById(id, function(err, post) {
		if (err) { return res.send(400, err); }
		post.createdOn = info.createdOn;
		post.author = info.author;
		post.title = info.title;
		post.body = info.body;
		post.save(function(err) {
			if (err) { return res.send(400, err); }
			return res.send(200);
		});

	});
};

exports.remove = function(req, res) {
	var id = req.params.id;
	Blog.findById(id, function(err, post) {
		if (err) { return res.send(403, err); }
		post.remove(function(err) {
			if (err) { return res.send(403, err); }
			return res.send(200);
		});
	});
};

exports.removeComment = function(req, res) {
	var id = req.params.id,
		commentId = req.params.commentId,
		i;

	Blog.findById(id, function(err, post) {
		if (err) { return res.send(403, err); }
		// find comment and remove
		for (i = 0; i < post.comments.length; i++) {
			if (post.comments[i]._id.toString() === commentId) {
				post.comments.splice(i, 1);
			}
		}
		// save post
		post.save(function(err) {
			if (err) { return res.send(403, err); }
			return res.send(200);
		});
	});
};