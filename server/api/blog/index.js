'use strict';

var express = require('express');
var controller = require('./blog.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/comment/', controller.createComment);
router.delete('/:id/comment/:commentId', controller.removeComment);

module.exports = router;