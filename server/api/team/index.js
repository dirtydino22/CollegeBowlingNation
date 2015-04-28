'use strict';

var express = require('express');
var controller = require('./team.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/', controller.index);
router.get('/:university', controller.getUniversity);

module.exports = router;
