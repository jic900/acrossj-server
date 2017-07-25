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
                } else if (req.body.newPassword !== req.body.confirmNewPassword) {
                    err = {message: 'The new password does not match the confirm password'};
                    next(util.getError('PasswordMisMatch', httpStatus.UNPROCESSABLE_ENTITY, err, null));
                } else {
                    user.password = req.body.newPassword;
                    User.updateUser(user, (err, user) => {
                        if (!err) {
                            res.json({message: `Password changed successfully`});
                        } else {
                            next(util.getError('UpdateUser', httpStatus.INTERNAL_SERVER_ERROR, err, null));
                        }
                    })
                }
            });
        }
    })
});

module.exports = router;