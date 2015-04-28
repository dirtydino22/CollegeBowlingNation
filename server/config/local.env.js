'use strict';

// Environment variables that grunt will set when the server starts locally. Use for your api keys, secrets, etc.
// You will need to set these on the server you deploy to.
//
// This file should not be tracked by git.

module.exports = {
  SESSION_SECRET: "cbn-secret",
  FACEBOOK_ID: "app-id",
  FACEBOOK_SECRET: "secret",
  TWITTER_ID: "app-id",
  TWITTER_SECRET: "secret",
  GOOGLE_ID: "app-id",
  GOOGLE_SECRET: "secret",
  MONGOLABDEV_URI: 'mongodb://admin:on3love@ds031328.mongolab.com:31328/dev',
  MONGOHQ_URI: 'mongodb://nodejitsu:7c7ddd81bedfc0384682c438e2f91d09@troup.mongohq.com:10000/nodejitsudb6246314507'
  // Control debug level for modules using visionmedia/debug
  // DEBUG: ""
};