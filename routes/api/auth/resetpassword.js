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
    authService.verifyToken(req.body.token, (err, decoded) => {
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
                } else {
                    const currentPassword = util.decrypt(user.password);
                    if (req.body.currentPassword && req.body.currentPassword !== currentPassword) {
                        err = {message: 'The current password entered is incorrect'};
                        next(util.getError('InvalidPassword', httpStatus.UNAUTHORIZED, err, null));
                    } else if (req.body.currentPassword && req.body.currentPassword === req.body.newPassword) {
                        err = {message: 'The new password cannot be the same as the current password'};
                        next(util.getError('SamePassword', httpStatus.UNPROCESSABLE_ENTITY, err, null));
                    } else {
                        user.password = req.body.newPassword;
                        User.updatePassword(user, (err, user) => {
                            if (!err) {
                                res.json({message: `Password changed successfully`});
                            } else {
                                next(util.getError('UpdatePassword', httpStatus.INTERNAL_SERVER_ERROR, err, null));
                            }
                        })
                    }
                }
            });
        }
    })
});

module.exports = router;