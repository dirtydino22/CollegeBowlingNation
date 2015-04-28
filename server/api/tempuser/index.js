'use strict';

var express = require('express');
var controller = require('./tempuser.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.post('/:handle/:id', controller.handle);

module.exports = router;