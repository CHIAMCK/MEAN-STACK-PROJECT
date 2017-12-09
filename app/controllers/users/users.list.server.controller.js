'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../errors.server.controller'),
    User = mongoose.model('User'),
    _ = require('lodash');

var crud = require('../crud.server.controller')('User', 'name');

module.exports = crud;
