/**
 * Created by LAE84266 on 04/08/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const AuthUtil = require(APP_BASE + '/utils/auth-util');

module.exports = (req, res, next) => {
    AuthUtil.verifyToken(req.body.token, next, decodedToken => {
        if (req.body) {
            req.body['username'] = decodedToken.username;
        } else {
            req.ACROSSJ_PARAMS.token = decodedToken;
        }
        next();
    })
};