/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const errors = require('properties-reader')(APP_BASE + '/resources/errors.properties');

logger.debug('Initializing model.user');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, errors.get('validation.user.username.required')],
        minlength: [2, errors.get('validation.user.username.minlength')],
        maxlength: [20, errors.get('validation.user.username.maxlength')],
        trim: true,
    },
    email: {
        type:String,
        unique:true,
        required: [true, errors.get('validation.user.email.required')],
        trim: true,
        match: [/.+@.+\..+/i, errors.get('validation.user.email.match')]
        // match: /.+\@.+\..+/,
        // match: /\S+@\S+\.\S+/
    },
    password: {
        type: String,
        required: [true, errors.get('validation.user.password.required')],
        minlength: [4, errors.get('validation.user.password.minlength')],
        trim: true,
        // validate: {
        //     validator: function (password) {
        //         return password.length >= 4;
        //     },
        //     message: 'A valid password is at least 4 characters long'
        // }
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
});

const uniqueValidator = require(APP_BASE +'/db/db').uniqueValidator;
User.plugin(uniqueValidator);

const autoIncrement = require(APP_BASE +'/db/db').autoIncrement;
User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id'
});

User.statics = {
    createUser: function(requestData, callback) {
        this.create(requestData, callback);
    },
    findAndUpdateUser: function(query, user, callback) {
        this.findOneAndUpdate(query, user, callback);
    },
    updateUser: function(user, callback) {
        user.save(callback);
    },
    findUser: function(query, callback) {
        this.findOne(query, callback);
    },
    findUserByIdAndUserName: function(id, username, callback) {
        this.findOne({ username: username, _id: id }, callback);
    }
}

const user = mongoose.model('user', User);
module.exports = user;

// 'use strict';
//
// var APP_BASE = process.env.NODE_PATH;
// var config = require(APP_BASE + '/config');
// var logger = require(APP_BASE + '/utils/logger')(module.filename);
// logger.debug('Initializing model.user');
//
// var mongoose = require('mongoose');
// //var q = require('q');
// var async = require('async');
// var bcrypt = require('bcrypt');
// var sequence = require(APP_BASE + '/models/sequence');
//
// var Schema = mongoose.Schema;
//
// var userSchema = new Schema({
//     _id: Number,
//     username: {
//         type: String,
//         unique: true,
//         trim: true,
//         required: true
//     },
//     password: {
//         type: String,
//         trim: true,
//         required: true
//     },
//
//      // password: {
//      // type: String,
//      // validate: [
//      // function (password) {
//      // return password.length >= 4;
//      // },
//      // 'Password should be longer'
//      // ]
//      // },
//
//     email: {
//         type:String,
//         trim: true
// //        required: true,
// //        unique:true
// //        match: /.+\@.+\..+/
//     },
//     address: String,
//     phone: String,
//     role: {
//         type: String,
//         enum: ['admin', 'user'],
//         default: 'user',
//         required: true
//     }
// });
//
// var generateHashedPassword = function(password, callback) {
//     bcrypt.genSalt(config.SALT_WORK_FACTOR, function(err, salt) {
//         if (err) {
//             callback(err);
//         } else {
//             bcrypt.hash(password, salt, function(err, hash) {
//                 if (err) {
//                     callback(err);
//                 } else {
//                     callback(null, hash);
//                 }
//             });
//         }
//     });
// }
//
// userSchema.pre('save', function(next) {
//     var user = this;
//     if (!user.isNew) {
//         return next();
//     }
//
//     sequence.next_seq('user', function(err, sequence) {
//         if (err) {
//             next(err);
//         } else {
//             user._id = sequence.seq;
//         }
//     });
//
//     var password = user.password;
//     user.password = undefined;
//     generateHashedPassword(password, function(err, hash) {
//         if (err) {
//             next(err);
//         } else {
//             user.password = hash;
//         }
//     });
//
//     async.until(
//         function() {
//             return (user._id && user.password)
//         },
//         function(callback) {
//             setTimeout(callback, 25);
//         },
//         function(err) {
//             if (err) {
//                 next(err);
//             } else {
//                 next();
//             }
//         }
//     );
// });
//
// userSchema.methods.comparePassword = function (password, callback) {
//     bcrypt.compare(password, this.password, function (err, isMatch) {
//         if (err) {
//             return callback(err);
//         }
//         callback(null, isMatch);
//     });
// };
//
// var User = mongoose.model('User', userSchema);
//
// var userInit = function() {
//     User.findOne({
//         username: 'admin'
//     }, function(err, user) {
//         if (err) {
//             logger.error(err.stack);
//         } else if (user) {
//             logger.warn('The admin user exists. User creation skipped');
//         } else {
//             var admin_user = new User({'username': 'admin', 'password': 'admin', 'role': 'admin'});
//             admin_user.save(function (err) {
//                 if (err) {
//                     logger.error(err.stack);
//                 } else {
//                     logger.info('The admin user successfully created.');
//                 }
//             });
//         }
//     });
// };
// userInit();
//
// module.exports = User;
