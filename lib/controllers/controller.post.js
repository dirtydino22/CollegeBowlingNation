'use strict';
var Post = require('../models/post');
/**
 * Post Controller
 */
exports.posts = function(req, res) {
	Post.find(function(err, posts) {
		(!err) ? res.json(posts) : res.json('There was an error retreiving posts.');
	});
};

exports.post = function(req, res) {
	var id = req.params.postId;
	if (id) {
		Post.findById(id, function(err, post) {
			(!err) ? res.json(post) : res.json('There was an error retreiving post.');
		});
	}
	else {
		res.json('An ID is required to retrieve post.');
	}
};

exports.postReply = function(req, res) {
	var id = req.params.postId;
	if (id) {
		Post.findById(id, function(err, post) {
			if (err) { return res.json('There was an error retreiving post.'); }
			post.replies.push({
				author: req.body.author,
				body: req.body.body
			});
			post.save(function(err) {
				(!err) ? console.log('Reply Added.') : console.log('Error adding reply.');
			});
		});
	}
	else {
		res.json('An ID is required to add reply to post.');
	}
};

exports.createPost = function(req, res) {
	var reqObj = req.body;
	var post = new Post({
		title: reqObj.title,
		author: reqObj.author,
		body: reqObj.body
	});
	post.save(function(err) {
		(!err) ? res.json(true) : res.json(false);
	});
	return res.jsonp(req.body);
};

exports.updatePost = function(req, res) {
	var reqObj = req.body;
	var id = req.req.params.postId;
	if (id) {
		Post.findById(id, function(err, post) {
			if (!err) {
				post.title = reqObj.title;
				post.author = reqObj.author;
				post.body = reqObj.body;
				post.save(function(err) {
					(!err) ? console.log('Post ID: ' + id + ' Updated.') : console.log('Error Updating Post ID :' + id);
					return res.send(post);
				});
			}
			else {
				console.log('There was an error updating post.');
			}
		});
	}
	else {
		res.json('An ID is required to update post.');
	}
};

exports.deletePost = function(req, res) {
	var id = req.req.params.postId;
	if (id) {
		Post.findById(id, function(err, post) {
			if (!err) {
				post.remove(function(err) {
					if (!err) { 
						return res.send('') 
					} 
					else { 
						console.log('Error removing post.'); 
					}
				});
			}
			else {
				console.log('Error retrieving post.');
			}
		});
	}
	else {
        console.log('ID required to remove post.');
    }
};