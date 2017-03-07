/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

var APP_BASE = process.cwd();
var config = require(APP_BASE + '/config');
var logger = require(APP_BASE + '/utils/logger')(module.filename);
logger.debug('Initializing model.user');

var mongoose = require('mongoose');
//var q = require('q');
var async = require('async');
var bcrypt = require('bcrypt');
var sequence = require(APP_BASE + '/models/sequence');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: Number,
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    /*
     password: {
     type: String,
     validate: [
     function (password) {
     return password.length >= 4;
     },
     'Password should be longer'
     ]
     },
     */
    email: {
        type:String,
        trim: true
//        required: true,
//        unique:true
//        match: /.+\@.+\..+/
    },
    address: String,
    phone: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        required: true
    }
});

var generateHashedPassword = function(password, callback) {
    bcrypt.genSalt(config.SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            callback(err);
        } else {
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, hash);
                }
            });
        }
    });
}

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isNew) {
        return next();
    }

    sequence.next_seq('user', function(err, sequence) {
        if (err) {
            next(err);
        } else {
            user._id = sequence.seq;
        }
    });

    var password = user.password;
    user.password = undefined;
    generateHashedPassword(password, function(err, hash) {
        if (err) {
            next(err);
        } else {
            user.password = hash;
        }
    });

    async.until(
        function() {
            return (user._id && user.password)
        },
        function(callback) {
            setTimeout(callback, 25);
        },
        function(err) {
            if (err) {
                next(err);
            } else {
                next();
            }
        }
    );
});

userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

var userInit = function() {
    User.findOne({
        username: 'admin'
    }, function(err, user) {
        if (err) {
            logger.error(err.stack);
        } else if (user) {
            logger.warn('The admin user exists. User creation skipped');
        } else {
            var admin_user = new User({'username': 'admin', 'password': 'admin', 'role': 'admin'});
            admin_user.save(function (err) {
                if (err) {
                    logger.error(err.stack);
                } else {
                    logger.info('The admin user successfully created.');
                }
            });
        }
    });
};
userInit();

module.exports = User;
