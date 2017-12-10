'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    asModel = require('as-model'),
    asController = require('as-controller'),
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},

	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer'],
        required: 'Please fill in a password'
	},
    phone: {
        type: String,
        default:'',
        unique: 'Mobile phone number not unique!',
        trim: true
    },
	salt: {
		type: String
	},
	provider: {
		type: String
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
        type: String,
        default: 'User',
        required: 'Please fill in the role',
        enum: ['Hub Admin', 'Site Admin', 'Administrator', 'Approver', 'Creator', 'System', 'User']
	},
    updated: {
        type: Date,
        default: Date.now,
        index:true
    },
    updatedBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	created: {
		type: Date,
		default: Date.now
	},
    updateLogs: [{
        updated: {
            type: Date
        },
        updatedBy: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }],
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

/*
 * Export data
 */
UserSchema.statics.exportData = function(user, query, projection, population, columns, cb) {
    asModel.setPageSize(query, 4000);
    this.listData(user, query, projection, population, function(err, ret){
        if (!err && ret) {
            if (ret.items && ret.items.length>0) {
                asModel.exportData(ret.items, columns, cb);
            } else {
                cb(new Error('No data!'));
            }
        } else {
            cb(err);
        }
    });
};


/*
 * List data
 */
UserSchema.statics.listData = function(user, query, projection, population, cb) {
    var tableState = query.tableState ? JSON.parse(query.tableState) : null;
    var account = tableState && tableState.search && tableState.search.predicateObject && tableState.search.predicateObject.account ? tableState.search.predicateObject.account : '';
    var _this = this;
    asModel.listData(this, user, query, account?{'accounts.obj':(account._id ? account._id : account)}:{}, projection, population, function(err, ret){
        if (!err) {
            cb(err, ret);
        }
    });
};

UserSchema.statics.exportDetails = function(req, res, Model) {
    var tableState = req.query.tableState ? JSON.parse(req.query.tableState) : null;

    asController.export(req, res, Model,
        {_id: 1, username: 1, displayName: 1, roles: 1, email: 1, phone: 1, status: 1, updated: 1},
        [{path: 'accounts.obj', select: '_id name services'}, {path: 'groups', select: 'title memberType'}],
        [{id:'username', name:'Username', type:'string'}, {id:'displayName', name:'Name', type:'string'},
            {id:'roles', name:'Roles', type:'string'}, {id:'email', name:'Email', type:'string'},
            {id:'phone', name:'Phone', type:'string'}
        ]);
};

mongoose.model('User', UserSchema);
