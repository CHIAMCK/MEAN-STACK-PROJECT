'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    config = require(__dirname+'/../../config/config'),
    moment = require('moment');


var User = mongoose.model('User', require(__dirname + '/../models/user.server.model.js').UserSchema);
//var Member = mongoose.model('Member', require(__dirname + '/../../models/member.server.model.js').MemberSchema);
var z = 0;
async.waterfall([function(next) {
    mongoose.connect(config.db, function() {
        var mongoosedb = mongoose.connection;
        mongoosedb.on('error', console.error.bind(console, 'connection error:'));
        mongoosedb.once('open', function callback() {
            console.log('Opened DB');
            next(0);
        });
    });
}, function(next) {
    User.find({roles:'Administrator'})
        .exec(function(err, users) {
            console.log('Total user found: ' + users.length);
            next(0, users);
        });
}, function(users, next) {
    async.eachSeries(users, function(user, foreachCallback) {
        console.log('Admin:' + user.username);
        foreachCallback(0);
    }, function(err) {
        next(0);
    });
}
], function(err) {
    console.log('Completed running. ');
    process.exit(err);
});
