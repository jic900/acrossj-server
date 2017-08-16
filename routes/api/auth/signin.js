/**
 * Created by LAE84266 on 22/06/2017.
 */

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const util = require(APP_BASE + '/utils/util');
const authUtil = require(APP_BASE + '/utils/auth-util');
const httpStatus = require('http-status-codes');
const router = require('express').Router();
const findUserBy = require(APP_BASE + '/middlewares/find-user-by');

const validatePassword = (req, res, next) => {
    const user = req.ACROSSJ_PARAMS.user;
    if (req.body.password !== util.decrypt(user.password)) {
        const err = {message: 'Invalid password'};
        next(util.getError('InvalidPassword', httpStatus.UNAUTHORIZED, err, null));
    } else if (!user.isVerified) {
        const err = {message: 'User not verified'};
        next(util.getError('NotVerified', httpStatus.UNAUTHORIZED, err, null));
    } else {
        const tokenData = {
            userId: user._id,
            userName: user.username,
            role: user.role
        };
        res.json({token: authUtil.createToken(tokenData)});
    }
}

router.route('/').post(findUserBy('username'), validatePassword);

module.exports = router;