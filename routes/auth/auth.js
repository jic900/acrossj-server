/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';
const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const config = require(APP_BASE + '/config');
const util = require(APP_BASE + '/utils/util');
const errors = require('properties-reader')(APP_BASE + '/resources/errors.properties');
const authService = require('./auth.service');
const jwt = require('jsonwebtoken');
const async = require('async');
const httpStatus = require('http-status-codes');
const User = require(APP_BASE + '/models/user');

exports.signUp = (req, res) => {
    req.body.password = util.encrypt(req.body.password);
    async.waterfall([
        function (callback) {
            User.createUser(req.body, (err, user) => {
                if (!err) {
                    callback(null, user);
                } else {
                    logger.error(err.stack);
                    if (err.name === 'ValidationError') {
                        callback(util.getError('validation', httpStatus.UNPROCESSABLE_ENTITY, err, 'user'), null);
                    } else {
                        callback(util.getError('newUserFailed', httpStatus.INTERNAL_SERVER_ERROR, err, null), null);
                    }
                }
            })
        },
        function (user, callback) {
            const tokenData = {
                username: user.username,
                id: user._id
            };
            const token = jwt.sign(tokenData, config.JWT.PRIVATE_KEY, {expiresIn: config.JWT.TOKEN_EXPIRY});
            authService.sendVerifyMail(user, token, req.lang, (err, result) => {
                if (err) {
                    logger.error(err.stack);
                    callback(util.getError('verifyMailFailed', httpStatus.FORBIDDEN, err, null), null);
                } else {
                    callback(null, {status: 'Success'});
                }
            });
        },
    ],
    function (err, result) {
        if (err) {
            return res.status(err.status).json(err);
        } else {
            res.json(result);
        }
    });
}

exports.signIn = (req, res) => {
    User.findUser({username: req.body.username}, (err, user) => {
        if (err) {
            return res.status(500).send(`Something went wrong`);
        } else if (user === null) {
            return res.status(422).send(`Email not recognized`);
        } else {
            if (req.body.password === util.decrypt(user.password)) {
                if (!user.isVerified) {
                    return res.status(401).send(`Your email address is not verified. please verify your email address to proceed`);
                } else {
                    const tokenData = {
                        username: user.username,
                        id: user._id
                    };
                    const result = {
                        username: user.username,
                        token: jwt.sign(tokenData, config.JWT.PRIVATE_KEY)
                    };
                    return res.json(result);
                }
            } else {
                return res.status(500).send(`Something went wrong`);
            }
        }
    })
}

exports.forgotPassword = (req, res) => {
    async.waterfall([
        function (callback) {
            User.findUser({username: req.body.username}, (err, user) => {
                if (!err) {
                    if (user === null) {
                        const error = {
                            statusCode: 422,
                            message: `Please provide another user email`
                        };
                        callback(error, null);
                    } else {
                        callback(null, user);
                    }
                } else {
                    const error = {
                        statusCode: 500,
                        message: `Something went wrong`
                    };
                    callback(error, null);
                }
            })
        },
        function (user, callback) {
            const tokenData = {
                username: user.username,
                id: user._id
            };
            authService.sendResetPasswordMail(user, jwt.sign(tokenData, config.JWT.PRIVATE_KEY), req.lang, (error, result) => {
                if (!error) {
                    callback(null, 'success');
                } else {
                    const error = {
                        statusCode: 500,
                        message: `Something went wrong`
                    };
                    callback(error, null);
                }
            });
        },
    ],
    // optional callback
    function (err, results) {
        if (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).send(err.message);
            } else {
                return res.status(500).send(`Oh uh, something went wrong`);
            }
        } else {
            return res.json({message: `reset password link sent to your mail.`});
        }
    });
}

exports.resetPassword = (req, res) => {
    jwt.verify(req.body.token, config.JWT.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send(`Something went wrong`);
        } else {
            User.findUserByIdAndUserName(decoded.id, decoded.username, (err, user) => {
                if (err) {
                    return res.status(500).send(`Something went wrong`);
                } else if (user === null) {
                    return res.status(422).send(`Email not recognized`);
                } else if (req.body.newPassword !== req.body.confirmNewPassword) {
                    return res.status(400).send(`Password Mismatch`);
                } else {
                    user.password = authService.encrypt(req.body.newPassword);
                    User.updateUser(user, (err, user) => {
                        if (!err) {
                            return res.json({message: `Password changed successfully`});
                        } else {
                            return res.status(500).send(`Something went wrong`);
                        }
                    })
                }
            });
        }
    })
}

exports.verifyEmail = (req, res) => {
    const token = req.query['verifyToken'];
    jwt.verify(token, config.JWT.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send(`Something went wrong`);
        } else {
            User.findUserByIdAndUserName(decoded.id, decoded.username, (err, user) => {
                if (err) {
                    return res.status(500).send(`Something went wrong`);
                } else if (user === null) {
                    return res.status(422).send(`Email not recognized`);
                } else if (user.isVerified === true) {
                    return res.json({message: `Account is already verified`});
                } else {
                    user.isVerified = true;
                    User.updateUser(user, (err, user) => {
                        if (!err) {
                            return res.json({message: `Account sucessfully verified`});
                        } else {
                            return res.status(500).send(`Something went wrong`);
                        }
                    });
                }
            })
        }
    })
}


// 'use strict';
//
// var APP_BASE = process.env.NODE_PATH;
// var config = require(APP_BASE + '/config');
// var logger = require(APP_BASE + '/utils/logger')(module.filename);
// logger.debug('Initializing auth');
//
// var jwt = require('jsonwebtoken');
// var User = require(APP_BASE + '/models/user');

// module.exports = function (req, res, next) {
//     User.findOne({
//         username: req.body.username
//     }, function (err, user) {
//         if (err) {
//             next(err);
//         } else if ( !user ) {
//             var httpStatus = require('http-status-codes');
//             var msg = httpStatus.getStatusText(httpStatus.UNAUTHORIZED) + ' : User not found.'
//             res.status(httpStatus.UNAUTHORIZED);
//             next(new Error(msg));
//         } else {
//             user.comparePassword(req.body.password, function (err, matched) {
//                 if (err) {
//                     next(err);
//                 } else if ( !matched ) {
//                     var msg = httpStatus.getStatusText(httpStatus.UNAUTHORIZED) + ' : Invalid password.'
//                     res.status(httpStatus.UNAUTHORIZED);
//                     next(new Error(msg));
//                 } else {
//                     var token = jwt.sign(user, config.JWT_SECRET, {
//                         expiresInMinutes: config.JWT_EXPIRE
//                     });
//                     res.json({
//                         message: 'Login Successful',
//                         token: token
//                     });
//                 }
//             })
//         }
//     });
// };
