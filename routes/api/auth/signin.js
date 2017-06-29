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
    const signinData = req.body.username.indexOf('@') === -1 ? {username: req.body.username} : {email: req.body.username};
    User.findUser(signinData, (err, user) => {
        if (err) {
            next(util.getError('FindUser', httpStatus.INTERNAL_SERVER_ERROR, err, null));
        } else if (user === null) {
            err = {message: 'Invalid username'};
            next(util.getError('InvalidUserName', httpStatus.UNAUTHORIZED, err, null));
        } else {
            if (req.body.password === util.decrypt(user.password)) {
                if (!user.isVerified) {
                    err = {message: 'User not verified'};
                    next(util.getError('NotVerified', httpStatus.UNAUTHORIZED, err, null));
                } else {
                    const tokenData = {
                        username: user.username,
                    };
                    const result = {
                        username: user.username,
                        token: authService.createToken(tokenData)
                    };
                    res.json(result);
                }
            } else {
                err = {message: 'Invalid password'};
                next(util.getError('InvalidPassword', httpStatus.UNAUTHORIZED, err, null));
            }
        }
    })
});

module.exports = router;