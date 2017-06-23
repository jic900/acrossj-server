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

sendResetPasswordMail = (user, token, lang, callback) => {
    const resetPasswordLink = "http://" + config.SERVER.DOMAIN_HOST + ":" + config.SERVER.DOMAIN_PORT + "/" + config.EMAIL.RESET_PASSWORD_URL + "/" + token;
    const from = `ACrossJ Admin<${config.EMAIL.USER}>`;
    const mailbody = `
        <p>Hi ${user.username},</p>
        <br/>
        <p>Please reset your password by clicking on the link below. The link will expire in ${config.JWT.TOKEN_EXPIRY}.</p>
        <br/>
        <a href=${resetPasswordLink.toString()}>Reset Password Link</a>`;
    util.mail(from, user.username , `Account Reset Password`, mailbody, function(error, success){
        callback(error, success);
    });
};

router.route('/').post((req, res, next) => {
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
                sendResetPasswordMail(user, jwt.sign(tokenData, config.JWT.PRIVATE_KEY), req.lang, (error, result) => {
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
});

module.exports = router;