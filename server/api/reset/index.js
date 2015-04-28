'use strict';

var express = require('express');
var controller = require('./reset.controller');


var router = express.Router();

router.get('/:token', controller.index);
router.post('/', controller.reset);

module.exports = router;
