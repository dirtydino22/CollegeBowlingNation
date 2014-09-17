'use strict';

var _ = require('lodash');

/**
 * Load Environment Configuration
 */
module.exports = _.merge(
  require('./env/all.js'),
  require('./env/' + process.env.NODE_ENV + '.js') || {});
