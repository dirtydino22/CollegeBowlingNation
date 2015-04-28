'use strict';

var Blog = require('./blog.model');

exports.index = function(req, res) {
	Blog.find(function(err, posts) {
		if (!!err) return res.send(404);
		return res.json(200, posts);
	});
};

exports.create = function(req, res) {
	var newPost = new Blog(req.body);
	newPost.save(function(err) {
		if (!!err) return res.send(500);
		return res.send(200);
	});
};

exports.update = function(req, res) {
	var updates = req.body;
	Blog.findById(req.params.id, function(err, post) {
		if (!!err) return res.send(404);
		post.createdOn = updates.createdOn;
		post.author = updates.author;
		post.title = updates.title;
		post.body = updates.body;
		post.save(function(err) {
			if (!!err) return res.send(500);
			return res.send(200);
		});

	});
};

exports.remove = function(req, res) {
	Blog.findById(req.params.id, function(err, post) {
		if (!!err) return res.send(404);
		post.remove(function(err) {
			if (!!err) return res.send(500);
			return res.send(200);
		});
	});
};

exports.createComment = function(req, res) {
	Blog.findById(req.params.id, function(err, post) {
		if (!!err) return res.send(404);
		post.comments.push(req.body);
		post.save(function(err) {
			if (!!err) return res.send(500);
			return res.send(200);
		});
	});
};

exports.removeComment = function(req, res) {
	Blog.findById(req.params.id, function(err, post) {
		if (!!err) return res.send(404);
		// find comment and remove
		for (var i = 0; i < post.comments.length; i++) {
			if (post.comments[i]._id.toString() === req.params.commentId) {
				post.comments.splice(i, 1);
			}
		}
		// save post
		post.save(function(err) {
			if (!!err) return res.send(500);
			return res.send(200);
		});
	});
};

exports.updateSocket = function(socket) {
	Blog.find(function(err, posts) {
		if (!!err) return socket.emit('error:nodata');
		return socket.emit('blog:update', posts);
	});
};