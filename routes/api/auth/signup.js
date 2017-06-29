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
            User.createUser(req.body, (err, user) => {
                if (!err) {
                    callback(null, user);
                } else {
                    if (err.name === 'ValidationError') {
                        callback(util.getError('Validation', httpStatus.UNPROCESSABLE_ENTITY, err, 'user'), null);
                    } else {
                        callback(util.getError('CreateUser', httpStatus.INTERNAL_SERVER_ERROR, err, null), null);
                    }
                }
            })
        },
        function (user, callback) {
            const tokenData = {
                username: user.username
            };
            const token = authService.createToken(tokenData);
            authService.sendVerifyMail(user, token, req.body.lang, (err, result) => {
                if (err) {
                    callback(util.getError('SendVerifyMail', httpStatus.FORBIDDEN, err, null), null);
                } else {
                    callback(null, {status: 'Verify email successfully sent'});
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