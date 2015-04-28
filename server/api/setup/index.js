'use strict';

var express = require('express');
var controller = require('./setup.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.setup);

module.exports = router;