'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    moment = require('moment'),
    _ = require('lodash'),
	async = require('async'),
    User = mongoose.model('User');



module.exports = function(modelName, sortBy) {

	var Model = mongoose.model(modelName);

	return {
		create: function(req, res) {

			var data = new Model(req.body);

			if (!data.updateLogs) {
				data.updateLogs = [];
			}

			var d = {
				updated: data.updated,
				updatedBy: data.updatedBy
			};

			data.updateLogs.unshift(d);

			data.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.status(201).json(data);
				}
			});
		},

		read: function(req, res) {
			res.json(req.modelName ? req.modelName : req.profile);
		},

		export: function(req, res) {
			Model.exportDetails(req, res, Model);
        },

		update: function(req, res) {
			var model = req.modelName ? req.modelName : req.profile;
			var data = req.body;

            if (!data.updateLogs) {
                data.updateLogs = [];
            }

            var d = {
                updated: Date.now(),
                updatedBy: data.updatedBy ? data.updatedBy : req.user._id
            };

            data.updateLogs.unshift(d);
            data.updated = d.updated;

            model = _.extend(model, data);

			model.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(model);
				}
			});
		},

		delete: function(req, res) {
			var model = req.modelName ? req.modelName : req.profile;

			model.remove(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(model);
				}
			});
		},

		list: function(req, res) {
			var query = {};
			if (req.query.tableState) {
				var para = req.query.tableState ? JSON.parse(req.query.tableState) : null;
				for (var k in para.search.predicateObject) {
					var field = null;
					var q = null;
                    var value = para.search.predicateObject[k];
                    if (para.search.predicateObject.hasOwnProperty(k)) {
                        var schema = Model.schema;
                        if (schema.paths[k]) {
                        	field = schema.paths[k].options.type.name;
						}

                        if (field !== null) {
                            switch (field) {
								case 'String':
                                    q = {$regex:value,$options:'is'};
                                    break;

								case 'Date':
                                    if (value && value.hasOwnProperty('startDate') && value.startDate && value.startDate !== null) {
                                        var start = moment(value.startDate).startOf('day');
                                        q = {$gte: start.toDate()};
                                    }
                                    if (value && value.hasOwnProperty('endDate') && value.endDate && value.endDate !== null) {
                                        var end = moment(value.endDate).endOf('day');
                                        q.$lt = end.toDate();
                                    }
                                    break;

								default:
									break;
                            }
                        }
                        if (q) {
                            query[k] = q;
                        }
                    }
				}
			}
			if (req.query.filter) {
				// TODO: extend this to handle multiple filters
				query = req.query.filter;
			}

            async.waterfall([
                function(callback) {
                    Model.find(query).populate('updateLogs.updatedBy').skip(para ? para.pagination.start : 0).limit(20).sort({updated:-1}).exec(function(err, models) {
                    	if (!err) {
                    		callback(null, models);
						}
                    });
                },
                function(models, callback) {
                    Model.count(query, function (err, count) {
                    	if(!err) {
                            callback(null, models, count);
                        }
                    });
                }
            ], function (err, models, count) {
				res.json({
					count : count,
					items: models
				});

            });
		},
		getByID: function(req, res, next, id) {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				return res.status(400).send({
					message: modelName + ' is invalid'
				});
			}

			Model.findById(id).populate('updatedBy').exec(function(err, model) {
				if (err) return next(err);
				if (!model) {
					return res.status(404).send({
		  				message: modelName + ' not found'
		  			});
				}
				req.modelName = model;
				next();
			});
		}
	};
};
