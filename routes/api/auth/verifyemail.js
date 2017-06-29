/**
 * Created by LAE84266 on 22/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const config = require(APP_BASE + '/config');
const util = require(APP_BASE + '/utils/util');
const errors = require(APP_BASE + '/resources/errors');
const httpStatus = require('http-status-codes');
const authService = require(APP_BASE + '/routes/api/auth/auth.service');
const router = require('express').Router();
const User = require(APP_BASE + '/models/user');

router.route('/').post((req, res, next) => {
    const token = req.query['token'];
    authService.verifyToken(token, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                next(util.getError('TokenExpired', httpStatus.UNAUTHORIZED, err, null));
            } else if (err.name === 'JsonWebTokenError') {
                next(util.getError('InvalidToken', httpStatus.UNAUTHORIZED, err, null));
            } else {
                next(util.getError('VerifyToken', httpStatus.INTERNAL_SERVER_ERROR, err, null));
            }
        } else {
            User.findUserByUserName(decoded.username, (err, user) => {
                if (err) {
                    next(util.getError('FindUser', httpStatus.INTERNAL_SERVER_ERROR, err, null));
                } else if (user === null) {
                    err = {message: 'User not found'};
                    next(util.getError('UserNotFound', httpStatus.UNPROCESSABLE_ENTITY, err, null));
                } else if (user.isVerified === true) {
                    res.json({status: 'AlreadyVerified', message: 'Account already verified'});
                } else {
                    user.isVerified = true;
                    User.updateUser(user, (err, user) => {
                        if (err) {
                            next(util.getError('UpdateUser', httpStatus.INTERNAL_SERVER_ERROR, err, null));
                        } else {
                            res.json({status: 'Verified', message: 'Account successfully verified'});
                            // TODO - redirect user with jwt to home page.
                        }
                    });
                }
            })
        }
    })
});

module.exports = router;