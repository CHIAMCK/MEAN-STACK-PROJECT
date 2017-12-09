'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    asModel = require('as-model'),
    User =mongoose.model('User', require(__dirname+'/user.server.model.js').UserSchema),
	validation = require('./validation.server.model');

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		default: '',
		trim: true
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
	name: {
		type: String,
		default: '',
		trim: true, 	
		unique : true,
		required: 'Name cannot be blank',
		validate: [validation.len(15), 'name must be 15 chars in length or less']
	},
    image: {
        type: String
    },
    updateLogs: [{
        updated: {
            type: Date
        },
        updatedBy: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }]
});

/*
 * List data
 */
CategorySchema.statics.listData = function(user, query, cb) {
    var tableState = query.tableState ? JSON.parse(query.tableState) : null;
    var _this = this;
    asModel.listData(this, user, query, function(err, ret){
        if (!err) {
            cb(err, ret);
        }
        cb(err, ret);
    });
};


mongoose.model('Category', CategorySchema);
