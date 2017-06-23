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

router.route('/').post((req, res, next) => {
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
});

module.exports = router;