/**
 * Created by LAE84266 on 22/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const config = require(APP_BASE + '/config');
const util = require(APP_BASE + '/utils/util');
const errors = require(APP_BASE + '/resources/errors');
const async = require('async');
const httpStatus = require('http-status-codes');
const authService = require(APP_BASE + '/routes/api/auth/auth.service');
const router = require('express').Router();
const User = require(APP_BASE + '/models/user');

router.route('/').post((req, res, next) => {

    async.waterfall([
        function (callback) {
            // const userData = {
            //     username: req.body.username,
            //     email: req.body.email
            // }
            const userData = req.body.email.indexOf('@') === -1 ? {username: req.body.email} : {email: req.body.email};
            User.findUser(userData, (err, user) => {
                if (!err) {
                    if (user === null) {
                        err = {message: 'User Not Found'};
                        callback(util.getError('UserNotFound', httpStatus.UNPROCESSABLE_ENTITY, err, null), null);
                    } else {
                        callback(null, user);
                    }
                } else {
                    callback(util.getError('FindUser', httpStatus.INTERNAL_SERVER_ERROR, err, null), null);
                }
            })
        },
        function (user, callback) {
            const tokenData = {
                username: user.username,
            };
            const token = authService.createToken(tokenData);
            logger.debug(JSON.stringify(user));
            authService.sendResetPasswordMail(user, token, req.body.lang, (err, result) => {
                if (!err) {
                    callback(null, {status: httpStatus.OK});
                } else {
                    callback(util.getError('SendResetPasswordMail', httpStatus.FORBIDDEN, err, null), null);
                }
            });
        },
    ],
    function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;