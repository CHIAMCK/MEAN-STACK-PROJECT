'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var mobiles = require('../../app/controllers/mobiles.server.controller');
    var apiAuth = require('../controllers/api.authorization.server.controller');

    app.route('/mobiles/signIn')
        .post(apiAuth, mobiles.updateMobile);


};
