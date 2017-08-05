/**
 * Created by LAE84266 on 04/08/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const authUtil = require(APP_BASE + '/utils/auth-util');
const httpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
    if (req.headers.authorization) {

        const pattern = new RegExp(/^Bearer$/i);
        const authParts = req.headers.authorization.split(' ');

        if (authParts.length !== 2 || ! pattern.test(authParts[0])) {
            const err = {message: 'Authorization header format: Bearer [token]'};
            next(util.getError('InvalidAuthHeader', httpStatus.UNPROCESSABLE_ENTITY, err, null));
        } else {
            authUtil.verifyToken(authParts[1], next, decodedToken => {
                if (req.body) {
                    req.body['username'] = decodedToken.username;
                } else {
                    req.ACROSSJ_PARAMS.token = decodedToken;
                }
                next();
            })
        }
    } else {
        const err = {message: 'No Authorization header found'};
        next(util.getError('AuthHeaderNotFound', httpStatus.UNPROCESSABLE_ENTITY, err, null));
    }
};