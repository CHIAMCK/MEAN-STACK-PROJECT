'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require(__dirname+'/../../config/config'),
    asController = require('as-controller'),
    asMobile = require('as-mobile'),
    User = mongoose.model('User');


exports.updateMobile = function(req, res) {
    asMobile.updateMobile(User, config, req, res);
};
