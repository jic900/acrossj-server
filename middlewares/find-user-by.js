/**
 * Created by LAE84266 on 05/08/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const httpStatus = require('http-status-codes');
const User = require(APP_BASE + '/models/user');

module.exports = (byProp) => {
    return (req, res, next) => {
        let userData = {};
        if (byProp === 'username' && req.body.username.indexOf('@') !== -1) {
            userData['email'] = req.body.username;
        } else {
            userData[byProp] = req.body[byProp];
        }
        User.findUser(userData, (err, user) => {
            if (err) {
                next(util.getError('FindUser', httpStatus.INTERNAL_SERVER_ERROR, err, null));
            } else if (!user) {
                const err = {message: 'User not found'};
                next(util.getError('UserNotFound', httpStatus.UNAUTHORIZED, err, null));
            } else {
                req.ACROSSJ_PARAMS.user = user;
                next();
            }
        });
    }
};