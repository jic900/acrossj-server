/**
 * Created by LAE84266 on 22/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const config = require(APP_BASE + '/config');
const util = require(APP_BASE + '/utils/util');
const errors = require('properties-reader')(APP_BASE + '/resources/errors.properties');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const async = require('async');
const httpStatus = require('http-status-codes');
const User = require(APP_BASE + '/models/user');

sendVerifyMail = (user, token, lang, callback) => {
    const verifyLink = "http://" + config.SERVER.DOMAIN_HOST + ":" + config.SERVER.DOMAIN_PORT + "/" + config.EMAIL.VERIFY_EMAIL_URL + "?verifyToken=" + token;
    const from = `ACrossJ Admin<${config.EMAIL.USER}>`;
    const mailbody = `
        <p>Hi ${user.username},</p>
        <br/>
        <p>Thanks for Registering. Please verify your email by clicking on the verification link below. The link will expire in ${config.JWT.TOKEN_EXPIRY}.</p>
        <br/>
        <a href=${verifyLink.toString()}>Verification Link</a>`;
    util.mail(from, user.email, `Account Verification`, mailbody, function(error, success) {
        callback(error, success);
    });
};

router.route('/').post((req, res, next) => {
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
            sendVerifyMail(user, token, req.lang, (err, result) => {
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
});

module.exports = router;