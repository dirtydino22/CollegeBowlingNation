(function() {
    'use strict';
    var Post = require('../models/post');
    var jwt = require('jwt-simple');
    var payload = { access: 'api' };
    var secret = 'cbn';
    var token = jwt.encode(payload, secret);
    /**
     * Post Controller
     */
    exports.posts = function(req, res) {
        if (req.params.token === token) {
            Post.find(function(err, posts) {
                if (!err) {
                    return res.json(posts);
                } else {
                    return res.json('There was an error retreiving posts.');
                }
            });
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };

    exports.post = function(req, res) {
        var id = req.params.postId;
        if (req.params.token === token) {
            if (id) {
                Post.findById(id, function(err, post) {
                    if (!err) {
                        return res.json(post);
                    } else {
                        return res.json('There was an error retreiving post.');
                    }
                });
            } else {
                res.json('An ID is required to retrieve post.');
            }
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };

    exports.postReply = function(req, res) {
        var id = req.params.postId;
        if (req.params.token === token) {
            if (id) {
                Post.findById(id, function(err, post) {
                    if (err) {
                        return res.json('There was an error retreiving post.');
                    }
                    post.replies.push({
                        author: req.body.author,
                        body: req.body.body
                    });
                    post.save(function(err) {
                        if (!err) {
                            console.log('Reply Added.');
                            res.json(true);
                        } else {
                            console.log('Error adding reply.');
                        }
                    });
                });
            } else {
                res.json('An ID is required to add reply to post.');
            }
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };

    exports.createPost = function(req, res) {
        var reqObj = req.body;
        var post = new Post({
            title: reqObj.title,
            author: reqObj.author,
            body: reqObj.body
        });
        if (req.params.token === token) {
            post.save(function(err) {
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

    exports.updatePost = function(req, res) {
        var reqObj = req.body;
        var id = req.req.params.postId;
        if (req.params.token === token) {
            if (id) {
                Post.findById(id, function(err, post) {
                    if (!err) {
                        post.title = reqObj.title;
                        post.author = reqObj.author;
                        post.body = reqObj.body;
                        post.save(function(err) {
                            if (!err) {
                                console.log('Post ID: ' + id + ' Updated.');
                            } else {
                                console.log('Error Updating Post ID :' + id);
                            }
                            return res.send(post);
                        });
                    } else {
                        console.log('There was an error updating post.');
                    }
                });
            } else {
                res.json('An ID is required to update post.');
            }
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };

    exports.deletePost = function(req, res) {
        var id = req.params.postId;
        if (req.params.token === token) {
            if (id) {
                Post.findById(id, function(err, post) {
                    if (!err) {
                        post.remove(function(err) {
                            if (!err) {
                                return res.send('');
                            } else {
                                console.log('Error removing post.');
                            }
                        });
                    } else {
                        console.log('Error retrieving post.');
                    }
                });
            } else {
                console.log('ID required to remove post.');
            }
        }
        else {
            return res.json('Unauthorized Access.');
        }
    };
}());