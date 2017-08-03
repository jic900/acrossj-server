/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');
const util = require(APP_BASE + '/utils/util');
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const errors = require('properties-reader')(APP_BASE + '/resources/errors.properties');

logger.debug('Initializing model.user');

const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;
const ValidatorError  = mongoose.Error.ValidatorError;
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, errors.get('validation.user.username.required')],
        minlength: [2, errors.get('validation.user.username.minlength')],
        maxlength: [20, errors.get('validation.user.username.maxlength')],
        match: [/^[^~!@#$%^&*()+`{}|\[\]\\:";'<>?,\/]*$/, errors.get('validation.user.username.match')],
        trim: true
    },
    email: {
        type:String,
        unique:true,
        required: [true, errors.get('validation.user.email.required')],
        trim: true,
        match: [/.+@.+\..+/i, errors.get('validation.user.email.match')]
    },
    password: {
        type: String,
        required: [true, errors.get('validation.user.password.required')]
    },
    // address: String,
    // phone: String,
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: errors.get('validation.user.role.match')
        },
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

User.pre('validate', function(next) {
    if (this.password && this.password.trim().length < 4) {
        const error = new ValidationError(this);
        error.errors.password = new ValidatorError('password', '', 'minlength', this.password);
        error.errors.password.message = errors.get('validation.user.password.minlength');
        next(error);
    } else {
        this.password = util.encrypt(this.password);
        next();
    }
});

const uniqueValidator = require(APP_BASE +'/db/db').uniqueValidator;
User.plugin(uniqueValidator);

const autoIncrement = require(APP_BASE +'/db/db').autoIncrement;
User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id',
    startAt: 1
});

User.statics = {
    createUser: function(requestData, callback) {
        this.create(requestData, callback);
    },
    findAndUpdateUser: function(query, user, callback) {
        this.findOneAndUpdate(query, user, callback);
    },
    updateUser: function(user, callback) {
        user.password = util.decrypt(user.password);
        user.save(callback);
    },
    updatePassword: function(user, callback) {
        user.save(callback);
    },
    findUser: function(query, callback) {
        this.findOne(query, callback);
    },
    findUserByUserName: function(username, callback) {
        this.findOne({ username: username}, callback);
    }
}

const user = mongoose.model('user', User);

module.exports = user;

