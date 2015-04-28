'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.put('/:id', auth.isAuthenticated(), controller.updateAccount);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/forgot', controller.forgotPassword);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/:id/bowler', controller.createBowler);
router.put('/:id/bowler/:bowlerId', controller.updateBowler);
router.post('/:id/bowler/:bowlerId/tenpin', controller.addBowlerTenpinGame);
router.post('/:id/bowler/baker', controller.addBakerGame);
router.delete('/:id/bowler/:bowlerId', controller.removeBowler);
router.get('/:id/roster', controller.roster);
router.post('/:id/newseason', controller.createNewSeason);

module.exports = router;
